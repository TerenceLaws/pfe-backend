const mongoose = require("../src/mongodb")

const locationSchema = new mongoose.Schema({
    id: {type: mongoose.ObjectId, required: [true, 'an ID is required']},
    facility_id: {type: mongoose.ObjectId, ref: 'Facility', required: [true, 'a facility\'s reference is required']},
    name: {type: String, required: [true, 'a name is required']},
    description: {type: String, required: [true, 'a description is required']},
    avg_time: {type: String, enum: ['15m', '30m', '1h', '2h', '5h']}
})

locationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('Location', locationSchema)