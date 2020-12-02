const mongoose = require("../src/mongodb")
const uuid = require("uuid").v4;

const facilityLocationSchema = new mongoose.Schema({
    id: {type: String, default: uuid()},
    facility_id: {type: mongoose.ObjectId, ref: 'Facility', required: [true, 'a facility is required for this location']},
    name: String,
    description: String
})

facilityLocationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('FacilityLocation', facilityLocationSchema)