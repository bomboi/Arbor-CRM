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
    }]
})

module.exports = mongoose.model('Material', materialSchema);