const Citizen = require("../models/citizen")
const FacilityLocation = require("../models/location")
const Professional = require("../models/professional")
const QRCode = require("../models/qrCode")

// Citizen-related Config
const testCitizens = [
    new Citizen({}),
    new Citizen({})
]
const testAddCitizen = {}

// Professional-related Config
const testProfessionals = [
    new Professional({
        name: "Facility#1",
        address: "Rue de la paix, 23",
        mail: "jess@mail.com",
        password: "azerty1.",
        is_doctor: false
    }),
    new Professional({
        name: "Doctor#1",
        address: "Rue de la medecine, 89",
        mail: "doctor@mail.com",
        password: "azerty1.",
        is_doctor: true
    })
]
const testAddProfessional = {
    name: "Facility#2",
    address: "Rue de la loi, 47",
    mail: "test@mail.be",
    password: "qwerty2.",
    is_doctor: false
}
const professionalLoginWrongMail = {
    mail: "mostDefinitelyNotInDb@mail.be",
    password: "password_wont_get_tested_anyway."
}
const professionalLoginSuccess = {
    mail: testAddProfessional.mail,
    password: testAddProfessional.password
}
const professionalLoginWrongPass = {
    mail: testAddProfessional.mail,
    password: "most_definitely_a_wrong_password"
}
const professionalRegisterUsedMail = {
    name: "Facility#3",
    address: "Rue du test, 165",
    mail: testProfessionals[0].mail,
    password: "undeuxTest56.",
    is_doctor: false
}

// Location-related Config
const testLocations = [
    new FacilityLocation({
        facility_id: "123",
        name: "Location Alpha",
        description: "Description for Location Alpha",
        interval: "1h"
    }),
    new FacilityLocation({
        facility_id: "456",
        name: "Location Zulu",
        description: "Description for Location Zulu",
        interval: "2h"
    })
]
const testAddLocation = {
    facility_id: testProfessionals[0]._id,
    name: "Location Hotel",
    description: "Description for Location Hotel",
    interval: "5h"
}

// QRCode-related Config
const testQRCodes = [
    new QRCode({
        doctor_id: null,
        location_id: testLocations[0]._id
    }),
    new QRCode({
        doctor_id: testProfessionals[1]._id,
        location_id: null
    })
]
const testAddQRCode = {
    doctor_id: null,
    location_id: testLocations[0]._id
}
const scanNonDoctorQRCode = {
    qrcode_id: testQRCodes[0]._id,
    citizen_id: testCitizens[0]._id
}
const scanDoctorQRCode = {
    qrcode_id: testQRCodes[1]._id,
    citizen_id: testCitizens[0]._id
}

module.exports = {
    testCitizens,
    testAddCitizen,

    testProfessionals,
    testAddProfessional,
    professionalLoginWrongMail,
    professionalLoginSuccess,
    professionalLoginWrongPass,
    professionalRegisterUsedMail,

    testLocations,
    testAddLocation,

    testQRCodes,
    testAddQRCode,
    scanNonDoctorQRCode,
    scanDoctorQRCode
}