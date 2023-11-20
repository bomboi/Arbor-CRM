const mongoose = require('mongoose')
const Order = require('./Order')

const materialSchema = new mongoose.Schema({
    producer: {
        type: String,
        required: true
    },
    names: [{
        type: String,
        required: false
    }],
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('Material', materialSchema);