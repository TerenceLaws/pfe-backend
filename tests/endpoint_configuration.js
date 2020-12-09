const Citizen = require("../models/citizen")
const FacilityLocation = require("../models/location")
const Professional = require("../models/professional")
const QRCode = require("../models/qrCode")
const ScannedCode = require("../models/scan")
const mongoose = require("mongoose")

// Citizen-related Config
const testCitizens = [
    new Citizen({id: mongoose.Types.ObjectId()}),
    new Citizen({id: mongoose.Types.ObjectId()})
]
const testAddCitizen = {}

// Professional-related Config
const testProfessionals = [
    new Professional({
        id: mongoose.Types.ObjectId(),
        name: "Facility#1",
        address: "Rue de la paix, 23",
        mail: "jess@mail.com",
        password: "azerty1.",
        is_doctor: false
    }),
    new Professional({
        id: mongoose.Types.ObjectId(),
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
        id: mongoose.Types.ObjectId(),
        facility_id: testProfessionals[0].id,
        name: "Location Alpha",
        description: "Description for Location Alpha",
        avg_time: "1h"
    }),
    new FacilityLocation({
        id: mongoose.Types.ObjectId(),
        facility_id: testProfessionals[0].id,
        name: "Location Zulu",
        description: "Description for Location Zulu",
        avg_time: "2h"
    })
]
const testAddLocation = {
    facility_id: testProfessionals[0].id,
    name: "Location Hotel",
    description: "Description for Location Hotel",
    interval: "5h"
}

// QRCode-related Config
const testQRCodes = [
    new QRCode({
        id: mongoose.Types.ObjectId(),
        doctor_id: null,
        location_id: testLocations[0].id
    }),
    new QRCode({
        id: mongoose.Types.ObjectId(),
        doctor_id: testProfessionals[1].id,
        location_id: null
    })
]
const testAddQRCode = {
    doctor_id: null,
    location_id: testLocations[0].id
}
const scanNonDoctorQRCode = {
    qrcode_id: testQRCodes[0].id,
    citizen_id: testCitizens[0].id
}
const scanDoctorQRCode = {
    qrcode_id: testQRCodes[1].id,
    citizen_id: testCitizens[0].id
}

// QRcodes for location => testLocations[0].id
// Location from facility => testAddProfessional[0]
const testFacilityQRCodesURL = testProfessionals[0].id

// ScannedCodes-related Config
const testScannedCodes = [
    new ScannedCode({
        id: mongoose.Types.ObjectId(),
        citizen_id: testCitizens[0].id,
        qrcode_id: testQRCodes[0].id
    }),
    new ScannedCode({
        id: mongoose.Types.ObjectId(),
        citizen_id: testCitizens[1].id,
        qrcode_id: testQRCodes[0].id
    })
]
const testAddScannedCode = {
    citizen_id: testCitizens[1].id,
    qrcode_id: testQRCodes[0].id
}
const testAddScannedCodeNotInDb = {
    citizen_id: 345,
    qrcode_id: testQRCodes[0].id
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
    scanDoctorQRCode,
    testFacilityQRCodesURL,

    testScannedCodes,
    testAddScannedCode,
    testAddScannedCodeNotInDb
}