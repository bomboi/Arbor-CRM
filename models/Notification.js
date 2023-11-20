const mongoose = require('mongoose')
const Order = require('./Order')

const notificationSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    },
    type: String, // orderCommented | orderUpdated | orderDeleted
    text: String,
    dateChanged: Date,
    isRead: {
        type: Boolean,
        required: true,
        default: false
    },
    changedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    forUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('Notification', notificationSchema);