const mongoose = require('mongoose')

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
    }
})

module.exports = mongoose.model('Product', productSchema);