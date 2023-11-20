const router = require('express').Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderData = require('../models/OrderData');   
const Setting = require('../models/Settings');
const isAuthenticated = require('../routes/auth').isAuthenticated;
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const session = require('express-session');
const date_fns = require('date-fns');

router.use(isAuthenticated);

const shuffle = (string) => {
    var parts = string.split('');
    for (var i = parts.length; i > 0;) {
        var random = parseInt(Math.random() * i);
        var temp = parts[--i];
        parts[i] = parts[random];
        parts[random] = temp;
    }
    return parts.join('');
}

const calculateTotalPrice = (acc, value) => {
    let articlePrice = parseInt(value.price) * parseFloat(value.quantity) * (100 - parseInt(value.discount)) / 100;
    return parseInt(acc) + parseInt(articlePrice);
}

router.get('/all', async (req, res) => {
    let orders = await Order.find({})
                            .populate('customer', '-_id -__v -orders')
                            .populate('latestVersionData', 'data.orderInfo.date')
                            .select('-__v -comments')
                            .limit(5)
                            .exec();
    res.status(200);
    res.send(orders);
})

router.post('/post-comment', async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        console.log(req.body);
        let order = await Order.findOne({_id: req.body.orderId}).exec();
        let data = {
            text: req.body.comment,
            writtenBy: req.session.user,
            datePosted: new Date()
        }
        order.comments.push(data)
        await order.save();
    
    
        let users = await User.find({username: {$ne: "matija"}}).select('_id firstName active').exec();
        let currentUser = users.filter(user => user._id.toString() == req.session.user)[0];
        let otherUsers = users.filter(user => user._id.toString() != req.session.user && user.active);

        let notifications = []
        for(user of otherUsers) {
            let notification = new Notification();
            notification.dateChanged = new Date();
            notification.orderId = order._id;
            notification.forUser = user._id;
            notification.changedBy = currentUser._id;
            notification.type = "orderCommented";
            notification.text = "Korisnik " + currentUser.firstName + " je dodao novi komentar na porudzbinu " + order.orderId + ".";
            notifications.push(notification);
        }

        
        for(notification of notifications) {
            await notification.save();
        }
        
        await session.commitTransaction();
        session.endSession();

        res.status(200);
        res.send(data)
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.post('/update-state', async (req, res) => {
    let orders = await Order.find({_id: {$in: req.body.selectedIds}}).exec();
    console.log(req.body.selectedIds)
    for(let order of orders) {
        order.state = req.body.state;
        await order.save();
    }
    res.sendStatus(200);
})

router.post('/add-version', async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        let order = await Order.findOne({orderId: req.body.orderId}).exec();
    
        const reqData = req.body;
    
        // Creating Order Data for new version
        let orderData = new OrderData();
        orderData.orderId = order._id;
        orderData.version = order.latestVersion + 1;
        orderData.dateCreated = new Date();
        orderData.changedBy = req.session.user;
        orderData.data.articles = reqData.articles;
        orderData.data.orderInfo = reqData.orderInfo;
        await orderData.save();
    
        // Copying new data to Order
        order.latestVersionData = orderData._id;
        order.latestVersion = orderData.version;
        order.latestVersionDate = orderData.data.orderInfo.date;
    
        // Check if customer exists and update accordingly, otherwise create new customer
        let customer = null;
        if(reqData.customer !== undefined && reqData.customer._id !== undefined) {
            order.customer = reqData.customer._id;
            customer = await Customer.findOne({_id: order.customer}).exec();
            customer.orders.push(order._id);
            await customer.save();
        }
        else {
            customer = new Customer();
        }
        customer.name = reqData.customer.name;
        customer.phone = reqData.customer.phone;
        customer.email = reqData.customer.email;
        customer.address = reqData.customer.address;
        await customer.save();
    
        // Calculate new Order amount
        order.totalAmount = reqData.articles.reduce(calculateTotalPrice, [0]) * (100 - reqData.orderInfo.discount) / 100;
        await order.save();
    
        // Delete old notification if exists
        await Notification.deleteOne({orderId: order._id}).exec();

        // Add new notification
        // Get all users that are not admin matija
        let users = await User.find({username: {$ne: "matija"}}).select('_id firstName active').exec();
        let currentUser = users.filter(user => user._id.toString() == req.session.user)[0];
        let otherUsers = users.filter(user => user._id.toString() != req.session.user && user.active);

        let notifications = []
        for(user of otherUsers) {
            let notification = new Notification();
            notification.dateChanged = new Date();
            notification.orderId = order._id;
            notification.forUser = user._id;
            notification.changedBy = currentUser._id;
            notification.type = "orderUpdated"
            notification.text = `Korisnik ${currentUser.firstName} je izmenio porudzbinu ${order.orderId}.`;
            notifications.push(notification);
        }

        for(notification of notifications) {
            await notification.save();
        }
    
        await session.commitTransaction();
        session.endSession();
    
        res.sendStatus(200);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
})

router.post('/read-notification', async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        console.log(req.session.user);
        console.log(req.body.orderId);

        let notifications = await Notification.find({orderId: req.body.orderId, forUser: req.session.user, isRead: false}).exec();
        const length = notifications.length
        console.log("read", length)
        for(notification of notifications) {
            notification.isRead = true;
    
            await notification.save();
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200);
        res.send({length: length});
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})

router.get('/get-versions', async (req, res) => {
    try{
        // console.log(req.query.orderId);
        let orderVersions = await OrderData.find({orderId: req.query.orderId})
                                     .sort({version: 1})
                                     .populate('changedBy')
                                     .exec();
        let order = await Order.findOne({_id: req.query.orderId}).populate('comments.writtenBy customer').exec();
        // console.log(orderVersions);
        // console.log(order);
        let data = {orderVersions: orderVersions, comments: order.comments, order: order};
        // console.log(data);
        res.status(200);
        res.send(data);
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})

router.post('/delete', async (req, res) => {
    try{
        const session = await mongoose.startSession();
        session.startTransaction();

        console.log(req.body.ids);

        let orders = await Order.find({_id: {$in: req.body.ids}}).exec();
        console.log(orders);

        if(orders.length > 0) {
            let deletedOrders = orders.map(order => ({orderId: order.orderId, id: order._id}));
            console.log(deletedOrders);

            for(order of orders) {
                let customer = await Customer.findOne({_id: order.customer}).exec();
                let index = customer.orders.findIndex(item => item === order._id);
                customer.orders.splice(index, 1);
                await customer.save();
        
                await OrderData.deleteMany({orderId: order._id}).exec();
        
                await Order.deleteOne({_id: order._id}).exec();
            }
        
            let users = await User.find({username: {$ne: "matija"}}).select('_id firstName active').exec();
            let currentUser = users.filter(user => user._id.toString() == req.session.user)[0];
            let otherUsers = users.filter(user => user._id.toString() != req.session.user && user.active);
            
            let notificationText = "";
            if(deletedOrders.length > 1) {
                notificationText = `Korisnik ${currentUser.firstName} je obrisao porudzbine: `;
                for(let deletedOrder of deletedOrders) notificationText += deletedOrder.orderId + ', ';
                // TODO: Delete last coma
            }
            else {
                notificationText = `Korisnik ${currentUser.firstName} je obrisao porudzbinu ${deletedOrders[0].orderId}.`;
            }
            
            let notifications = []
            for(user of otherUsers) {
                for(deletedOrder of deletedOrders) {
                    let notification = new Notification();
                    notification.dateChanged = new Date();
                    notification.changedBy = currentUser._id;
                    notification.forUser = user._id;
                    notification.type = "orderDeleted"
                    notification.text = notificationText
                    notifications.push(notification);
                }
            }
        
            for(notification of notifications) {
                await notification.save();
            }
        }

        await session.commitTransaction();
        session.endSession();
    
        res.sendStatus(200);
    }
    catch(error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
})

router.get('/notifications', async (req, res) => {
    try {
        console.log(req.session.user);
        console.log(req.query.readNotifications);
        const readNotifications = req.query.readNotifications === 'true';
        let prevMonthBeginning = date_fns.subMonths(new Date(), 1);
        await Notification.deleteMany({dateChanged: {$lte: prevMonthBeginning}});
        let notifications = await Notification.find({forUser: req.session.user})
                                                .sort([['dateChanged', -1]])
                                                .populate('orderId')
                                                .exec();
        
        const notificationToReturn = JSON.parse(JSON.stringify(notifications.slice(0,10)));

        if(readNotifications) {
            for(notification of notifications) {
                if(!notification.isRead) {
                    console.log('read notification')
                    notification.isRead = true;
                    await notification.save();
                }
            }
        }
        // console.log(notifications);
        // console.log(notificationToReturn);
        res.status(200);
        res.send(notificationToReturn);
    }
    catch(error) {
        console.log(error)
        res.status(500);
        res.send(error.message);
    }
})

router.post('/delete-notifications', async (req, res) => {
    try {
        await Notification.deleteMany({forUser: req.session.user}).exec();

        res.send(200);
    }
    catch(error) {
        console.log(error)
        res.status(500);
        res.send(error.message);
    }
})

router.post('/delete-notification', async (req, res) => {
    try {
        await Notification.deleteOne({_id: req.body.notificationId}).exec();

        res.send(200);
    }
    catch(error) {
        console.log(error)
        res.status(500);
        res.send(error.message);
    }
})

router.get('/search', async (req, res) => {
    try {
        req.query.filters = JSON.parse(req.query.filters)
        let orders = [];
        let filters = {};
    
        // Set filters if sent
        // Set orderId filter
        if(req.query.filters.orderId !== '') {
            if(req.query.filters.orderId.startsWith('arh')) {
                req.query.filters.orderId = req.query.filters.orderId.substring(3);
            }
            filters.orderId = req.query.filters.orderId; 
        }
    
        // Sort orders according to filter
        let sort = req.query.filters.sort === 'Najnovije' ? -1 : 1;
    
        // Check if date range is used and set filters accordingly
        const hasRange = req.query.filters.range !== null && req.query.filters.range[0] !== '' && req.query.filters.range[1] !== ''; 
        if(hasRange) {
            filters.latestVersionDate = {$gte: req.query.filters.range[0], $lte: req.query.filters.range[1]}
        }
        if(req.query.filters.status !== '' && req.query.filters.status !== 'sve' ) {
            filters.state = req.query.filters.status;
        }
        
        let orderIds = [];
        if(req.query.filters.customerName !== '') {
            var regexp = new RegExp(".*"+ req.query.filters.customerName + ".*", "i");
            orderIds = await Customer.find({name: regexp}).select('orders -_id').exec();
            orderIds = orderIds.reduce((acc, val) => {return acc.concat(val.orders)}, []);
            filters._id = {$in: orderIds};
        }

        if(!req.query.lastOrderDate) {
            orders = await Order.find({...filters})
                                .sort([['latestVersionDate', sort]])
                                .populate('customer', ' -__v -orders')
                                .populate('latestVersionData', 'data.orderInfo.date')
                                .select('-__v -comments')
                                .limit(parseInt(req.query.pageSize))
                                .exec();
        }
        else {
            let latestVersionDate = {$lt: req.query.lastOrderDate};
            if(hasRange) latestVersionDate.$lte = filters.latestVersionDate.$lte;
            orders = await Order.find({...filters, latestVersionDate: latestVersionDate})
                                .sort([['latestVersionDate', sort]])
                                .populate('customer', ' -__v -orders')
                                .populate('latestVersionData', 'data.orderInfo.date')
                                .select('-__v -comments')
                                .limit(parseInt(req.query.pageSize))
                                .exec();
        }
        
        let notifications = await Notification.find({orderId: {$in: orders.map(order => order._id)}}).exec();
        let data = orders.map(order => ({ 
            ...order.toObject(), 
            hasNotification: false
            // notifications.some(item => item.orderId.equals(order._id) && item.readBy.some(item => item.equals(req.session.user)))
        }))
    
        res.status(200);
        res.send(data);
    }
    catch(error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
})

router.post('/add', async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log((new Date(req.body.orderInfo.date)).getFullYear())
    const date = new Date(req.body.orderInfo.date);

    let setting = await Setting.findOne({name: 'MonthlyNumberOfOrders', owner: 'app'}).exec();
    setting.value = '' + ((parseInt(setting.value) + 1)%100);
    console.log(setting)
    await setting.save();
    
    const reqData = req.body;
    let order = new Order();

    let orderId = shuffle('' + date.getFullYear() + date.getDate() + ('0000' + (setting.value)).slice(-2)); 

    order.state = 'poruceno';
    order.latestVersion = 0;
    order.orderId = orderId;
    order.totalAmount = reqData.articles.reduce(calculateTotalPrice, [0]) * (100 - reqData.orderInfo.discount) / 100;
    if(reqData.orderInfo.delivery) order.totalAmount += reqData.orderInfo.deliveryPrice;

    console.log('Total amount:' +  order.totalAmount);

    let customer = reqData.customer;
    if(customer._id === undefined) {
        // TODO: Check if exists already (same name and phone number)
        customer = new Customer();
        customer.name = reqData.customer.name;
        customer.phone = reqData.customer.phone;
        customer.email = reqData.customer.email;
        customer.address = reqData.customer.address;
        customer.orders = [];
        await customer.save();
    }
    else customer = await Customer.findOne({_id: customer._id}).exec();
    order.customer = customer._id;
    await order.save();


    console.log("order note", req.body.orderInfo.note)
    let orderData = new OrderData();
    orderData.orderId = order._id;
    orderData.version = 0;
    orderData.dateCreated = new Date();
    orderData.changedBy = req.session.user;
    orderData.data.articles = reqData.articles;
    orderData.data.orderInfo = reqData.orderInfo;
    await orderData.save();

    order.latestVersionData = orderData._id;
    order.latestVersionDate = orderData.data.orderInfo.date;

    await order.save();

    if(customer.orders === undefined) customer.orders = [];
    customer.orders.push(order._id);
    await customer.save();

    await session.commitTransaction();
    session.endSession();

    res.send(orderId).status(200);
})

router.get('/by-id/:id', async (req, res) => {
    console.log(req.params.id);
    let order = await Order.findOne({_id: req.params.id})
                            .select('-comments')
                            .populate('customer')
                            .populate('latestVersionData').exec();
    console.log(order)
    res.status(200)
    res.send(order);
})

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    let order = await Order.findOne({orderId: req.params.id}    )
                            .select('-comments')
                            .populate('customer')
                            .populate('latestVersionData').exec();
    console.log(order)
    res.status(200)
    res.send(order);
})

module.exports = router;