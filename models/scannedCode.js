const mongoose = require("../src/mongodb")

const scannedCodeSchema = new mongoose.Schema({
    citizen_id: {type: mongoose.ObjectId, ref: 'Citizen', required: [true, 'a citizen\'s reference is required']},
    qrcode_id: {type: mongoose.ObjectId, ref: 'QrCode', required: [true, 'a qr code\'s reference is required']},
    timestamp_enter: {type: Date, default: Date.now()},
    timestamp_exit: {type: Date, default: null}
})

scannedCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('ScannedCode', scannedCodeSchema)