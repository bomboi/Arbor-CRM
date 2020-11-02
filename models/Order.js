const mongoose = require('mongoose')
const Customer = require('./Customer');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer'
    },
    articles: [{
        name: String,
        description: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    date: String,
    avans: Number,
    paymentType: String,
    comments: [{
        type: String,
        required: false
    }],
})

module.exports = mongoose.model('Order', orderSchema);