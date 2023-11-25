const mongoose = require('mongoose')
const User = require('./User')

const sessionSchema = new mongoose.Schema({
    expires: Date,
    session: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        clientId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Client'
        }
    }
})

module.exports = mongoose.model('Session', sessionSchema);