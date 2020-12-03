const mongoose = require("../src/mongodb")

const facilityLocationSchema = new mongoose.Schema({
    facility_id: {type: mongoose.ObjectId, ref: 'Facility', required: [true, 'a facility\'s reference is required']},
    name: {type: String, required: [true, 'a name is required']},
    description: {type: String, required: [true, 'a description is required']},
    interval: {type: String, enum: ['30m', '1h', '2h', '5h']}
})

facilityLocationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('FacilityLocation', facilityLocationSchema)