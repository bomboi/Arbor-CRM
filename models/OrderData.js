const mongoose = require('mongoose')

const orderDataSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
    },
    version: Number,
    data: {
        articles: [{
            name: String,
            description: String,
            materials: [{
                producer: String,
                name: String, 
                description: String
            }],
            quantity: Number,
            price: Number,
            discount: Number,
            note: String
        }],
        orderInfo: {
            totalAmount: Number,
            date: Date,
            avans: Number,
            discount: Number,
            paymentType: String,
            deadlineFrom: Number,
            deadlineTo: Number,
            delivery: Boolean
        }
    },
    dateCreated: Date,
    changedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('OrderData', orderDataSchema);