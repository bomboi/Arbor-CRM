const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Client', clientSchema);