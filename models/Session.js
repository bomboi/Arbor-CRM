const mongoose = require('mongoose')
const User = require('./User')

const sessionSchema = new mongoose.Schema({
    sessionId: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Session', sessionSchema);