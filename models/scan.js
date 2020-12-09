const mongoose = require("../src/mongodb")

const scanSchema = new mongoose.Schema({
    id: {type: mongoose.ObjectId, required: [true, 'an ID is required']},
    citizen_id: {type: mongoose.ObjectId, ref: 'Citizen', required: [true, 'a citizen\'s reference is required']},
    qrcode_id: {type: mongoose.ObjectId, ref: 'QrCode', required: [true, 'a qr code\'s reference is required']},
    entry_date: {type: Date, default: Date.now()},
    exit_date: {type: Date, default: null}
})

module.exports = mongoose.model('Scan', scanSchema)