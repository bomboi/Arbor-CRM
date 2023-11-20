const mongoose = require('mongoose')
const Client = require('./Client')

const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: false
    },
    secondDiscountedPrice: {
        type: Number,
        required: false
    },
    materialLength: {
        type: Number,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('Product', productSchema);