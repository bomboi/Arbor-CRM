const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    owner: String | {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    name: String,
    value: String,
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('Setting', settingSchema);