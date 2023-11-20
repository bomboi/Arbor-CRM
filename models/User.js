const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['superadmin', 'admin', 'seller', 'factory']
    },
    active: {
        type: Boolean,
        required: false
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('User', userSchema);