const mongoose = require('mongoose')
const Order = require('./Order')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        street: String,
        floor: Number,
        elevator: Boolean
    },
    phone: {
        type: String,
        required: true
    },
    orders: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    }],
    comments: [{
        type: String,
        required: false
    }],
})

module.exports = mongoose.model('Customer', customerSchema);