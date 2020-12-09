const mongoose = require("../src/mongodb")

const locationSchema = new mongoose.Schema({
    facility_id: {type: mongoose.ObjectId, ref: 'Facility', required: [true, 'a facility\'s reference is required']},
    name: {type: String, required: [true, 'a name is required']},
    description: {type: String, required: [true, 'a description is required']},
    avg_time: {type: String, enum: ['15m', '30m', '1h', '2h', '5h']}
})

locationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Location', locationSchema)

exports.addEnumToDate = (date, value) => {
    switch(value){
        case "15m":
            return new Date(date.getTime() + 900000)
        case "30min":
            return new Date(date.getTime() + 1800000)
        case "1h":
            return new Date(date.getTime() + 3600000)
        case "2h":
            return new Date(date.getTime() + 7200000)
        case "5h":
            return new Date(date.getTime() + 18000000)
    }
}