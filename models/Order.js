const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderId: String,
    latestVersion: Number,
    latestVersionDate: Date,
    latestVersionData: {
        type: mongoose.Schema.ObjectId,
        ref: 'OrderData'
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer'
    },
    totalAmount: Number,
    state: String,
    comments: [{
        text: String,
        writtenBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        datePosted: Date
    }]
})

module.exports = mongoose.model('Order', orderSchema);