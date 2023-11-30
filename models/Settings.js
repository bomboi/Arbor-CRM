const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    monthlyNumberOfOrders: Number,
    defaultDeadlineStart: Number,
    defaultDeadlineEnd: Number,
    defaultCompanyInfo: String,
    defaultOrderNote: String,
    defaultProductDiscount: Number,
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    }
})

module.exports = mongoose.model('Setting', settingSchema);