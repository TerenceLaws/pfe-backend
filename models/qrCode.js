const mongoose = require("../src/mongodb")

const qrCodeSchema = new mongoose.Schema({
    doctor_id: {type: mongoose.ObjectId, ref: 'Doctor', required: [true, 'a doctor\'s reference is required']},
    facility_location_id: {type: mongoose.ObjectId, ref: 'FacilityLocation', required: [true, 'a facility\'s location is required']}
})

qrCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('QrCode', qrCodeSchema)