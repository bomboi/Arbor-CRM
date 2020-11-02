const mongoose = require('mongoose')
const Order = require('./Order');

const orderHistorySchema = new mongoose.Schema({
    orderId: String,
    previousOrders: [{
        order:{
            type: mongoose.Schema.ObjectId,
            ref: 'Order'
        },
        dateCreated: String,
        changedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }],
    currentOrder: {
        order:{
            type: mongoose.Schema.ObjectId,
            ref: 'Order'
        },
        dateCreated: String,
        changedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }
})

module.exports = mongoose.model('OrderHistory', orderHistorySchema);