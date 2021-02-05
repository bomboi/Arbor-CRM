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
    let articlePrice = parseInt(value.price) * parseInt(value.quantity) * (100 - parseInt(value.discount)) / 100;
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
    console.log(req.body);
    let order = await Order.findOne({_id: req.body.orderId}).exec();
    let data = {
        text: req.body.comment,
        writtenBy: req.session.user,
        datePosted: new Date()
    }
    order.comments.push(data)
    await order.save();
    res.status(200);
    res.send(data)
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
        let users = await User.find({username: {$ne: "matija"}}).select('_id').exec();
        let notification = new Notification();
        notification.dateChanged = new Date();
        notification.orderId = order._id;
        notification.readBy = users;
        await notification.save();
    
        await session.commitTransaction();
        session.endSession();
    
        res.sendStatus(200);
    }
    catch(error) {
        res.status(500).send(error.message);
    }
})

router.post('/read-notification', async (req, res) => {
    let notification = await Notification.findOne({orderId: req.body.orderId}).exec();

    console.log(notification)

    notification.readBy.splice(notification.readBy.findIndex(item => item.equals(req.session.user)), 1);
    if(notification.readBy.length > 0) await notification.save();
    else await Notification.deleteOne({orderId: req.body.orderId}).exec();

    console.log(notification);

    res.sendStatus(200);
})

router.get('/get-versions', async (req, res) => {
    let orderVersions = await OrderData.find({orderId: req.query.orderId})
                                 .sort({version: 1})
                                 .populate('changedBy')
                                 .exec();
    let order = await Order.findOne({_id: req.query.orderId}).populate('comments.writtenBy').exec();
    res.status(200);
    let data = {orderVersions: orderVersions, comments: order.comments};
    console.log(data);
    res.send(data);
})

router.post('/delete', async (req, res) => {
    let orders = await Order.find({_id: {$in: req.body.ids}}).exec();
    let deletedOrderIds = orders.map(order => order._id);
    for(order of orders) {
        let customer = await Customer.findOne({_id: order.customer}).exec();
        let index = customer.orders.findIndex(item => item === order._id);
        customer.orders.splice(index, 1);
        await customer.save();

        await OrderData.deleteMany({orderId: order._id}).exec();

        await Order.deleteOne({_id: order._id}).exec();
    }

    let notification = new Notification();
    if(deletedOrderIds.length > 1) {
        notification.text = 'Obrisane su sledece porudzbine: \n';
        for(let id of deletedOrderIds) notification.text += id + '\n';
    }
    else {
        notification.text = 'Obrisana je porudzbina broj ' + deletedOrderIds[0] + '.';
    }
    notification.dateChanged = new Date();
    notification.readBy = [];
    notification.changedBy = req.session.user;
    await notification.save();

    res.sendStatus(200);
})

router.get('/search', async (req, res) => {
    req.query.filters = JSON.parse(req.query.filters)
    let orders = [];
    let filters = {};

    // Set filters if sent
    if(req.query.filters.orderId !== '') {
        if(req.query.filters.orderId.startsWith('arh')) {
            req.query.filters.orderId = req.query.filters.orderId.substring(3);
        }
        filters.orderId = req.query.filters.orderId; 
    }
    let sort = req.query.filters.sort === 'Najnovije' ? -1 : 1;

    const hasRange = req.query.filters.range !== null && req.query.filters.range[0] !== '' && req.query.filters.range[1] !== ''; 
    if(hasRange) {
        filters.latestVersionDate = {$gte: req.query.filters.range[0], $lte: req.query.filters.range[1]}
    }
    if(req.query.filters.status !== '' && req.query.filters.status !== 'sve' ) {
        filters.state = req.query.filters.status;
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
        hasNotification: notifications.some(item => item.orderId.equals(order._id) && item.readBy.some(item => item.equals(req.session.user)))
    }))

    res.status(200);
    res.send(data);
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