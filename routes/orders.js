const router = require('express').Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderData = require('../models/OrderData');   
const Setting = require('../models/Settings');
const isAuthenticated = require('../routes/auth').isAuthenticated;

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
    let articlePrice = value.price * value.quantity * (100 - value.discount) / 100;
    return acc + articlePrice;
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

router.get('/search', async (req, res) => {
    req.query.filters = JSON.parse(req.query.filters)
    console.log(req.query)
    let orders = [];
    let filters = {};

    // Set filters if sent
    if(req.query.filters.orderId !== '') {
        if(req.query.filters.orderId.startsWith('arh')) {
            req.query.filters.orderId = req.query.filters.orderId.substring(3);
        }
        filters.orderId = req.query.filters.orderId; 
    }
    const hasRange = req.query.filters.range !== null && req.query.filters.range[0] !== '' && req.query.filters.range[1] !== ''; 
    if(hasRange) {
        filters.latestVersionDate = {$gte: req.query.filters.range[0], $lte: req.query.filters.range[1]}
    }
    if(req.query.lastOrderDate == null) {
        orders = await Order.find({...filters})
                            .populate('customer', '-_id -__v -orders')
                            .populate('latestVersionData', 'data.orderInfo.date')
                            .select('-__v -comments')
                            .limit(parseInt(req.query.pageSize))
                            .exec();
    }
    else {
        let latestVersionDate = {$gt: req.query.lastOrderDate};
        if(hasRange) latestVersionDate.$lte = filters.latestVersionDate.$lte;
        orders = await Order.find({...filters, latestVersionDate: latestVersionDate})
                            .populate('customer', '-_id -__v -orders')
                            .populate('latestVersionData', 'data.orderInfo.date')
                            .select('-__v -comments')
                            .limit(parseInt(req.query.pageSize))
                            .exec();
    }
    console.log(orders)
    res.status(200);
    res.send(orders);
})

router.post('/remove', async (req, res) => {

})

router.post('/add', async (req, res) => {

    console.log((new Date(req.body.orderInfo.date)).getFullYear())
    const date = new Date(req.body.orderInfo.date);

    let setting = await Setting.findOne({name: 'MonthlyNumberOfOrders', owner: 'app'}).exec();
    setting.value = '' + (parseInt(setting.value) + 1);
    console.log(setting)
    await setting.save();
    
    const reqData = req.body;
    let order = new Order();

    let orderId = shuffle('' + date.getFullYear() + date.getDate() + ('0000' + (setting.value)).slice(-2)); 

    order.state = 'ordered';
    order.latestVersion = 0;
    order.orderId = orderId;
    order.totalAmount = reqData.articles.reduce(calculateTotalPrice, [0]) * (100 - reqData.orderInfo.discount) / 100;


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
    orderData.data.customer = customer._id;
    orderData.data.articles = reqData.articles;
    orderData.data.orderInfo = reqData.orderInfo;
    await orderData.save();

    order.latestVersionData = orderData._id;
    order.latestVersionDate = orderData.data.orderInfo.date;

    await order.save();

    if(customer.orders === undefined) customer.orders = [];
    customer.orders.push(order._id);
    await customer.save();
    res.sendStatus(200);
})

module.exports = router;