const mongoose = require("../src/mongodb")
const uuid = require("uuid").v4;

const scannedCodeSchema = new mongoose.Schema({
    id: { type: String, default: uuid()},
    citizen_id: {type: mongoose.ObjectId, ref: 'Citizen'},
    qrcode_id: {type: mongoose.ObjectId, ref: 'QrCode'},
    date_time: {type: Date, default: Date.now()}
})

scannedCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('ScannedCode', scannedCodeSchema)