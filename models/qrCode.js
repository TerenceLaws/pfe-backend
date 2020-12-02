const mongoose = require("../src/mongodb")
const uuid = require("uuid").v4;

const qrCodeSchema = new mongoose.Schema({
    id: { type: String, default: uuid()},
    doctor_id: {type: mongoose.ObjectId, ref: 'Doctor'},
    facility_location_id: {type: mongoose.ObjectId, ref: 'FacilityLocation' }
})

qrCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('QrCode', qrCodeSchema)