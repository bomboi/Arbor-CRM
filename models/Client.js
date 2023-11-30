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
    },
    plan: {
        type: String,
        required: true,
        default: 'basic',
        enum: ['basic', 'classic', 'professional']
    },
})

module.exports = mongoose.model('Client', clientSchema);