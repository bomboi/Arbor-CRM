const mongoose = require('mongoose')
const Order = require('./Order')

const notificationSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    },
    dateChanged: Date,
    readBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Notification', notificationSchema);