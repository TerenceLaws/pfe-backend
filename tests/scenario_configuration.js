// Register Jessica, Marco, Jean, Thomas, Hilde

// Creer Institut Paul Lambin, Docteur Jacques
// Institut Paul Lambin a deux locaux: local 27 (avg_time: 1h) et local 28 (avg_time: 2h).

// Jean:    8h30-10h30 (27), 12h-14h (28)
// Hilde:   8h30-10h30 (28), 12h-14h (27) => Pas de contact
// J&M:     12h-14h (28) => Contact | Marco oublie de scanner la sortie.
// Thomas:  10h-12h (27) => Contact

// Le soir 20h, Jean va chez le docteur Jacques et est teste positif. Il scanne donc le QR Code du docteur.
// Une notification doit donc etre envoyee a tous les etudiants sauf Hilde.

const Citizen = require("../models/citizen")
const Professional = require("../models/professional")
const FacilityLocation = require("../models/location")
const QRCode = require("../models/qrCode")

const citizens = [
    new Citizen({}),    // 0: Jessica
    new Citizen({}),    // 1: Marco
    new Citizen({}),    // 2: Jean
    new Citizen({}),    // 3: Thomas
    new Citizen({})     // 4: Hilde
]

const jessica = citizens[0]._id
const marco = citizens[1]._id
const jean = citizens[2]._id
const thomas = citizens[3]._id
const hilde = citizens[4]._id

const professionals = [
    new Professional({
        name: "Institut Paul-Lambin",
        address: "Clos Chapelle-aux-Champs, 43",
        mail: "support@vinci.be",
        password: "azerty1.",
        is_doctor: false
    }),
    new Professional({
        name: "Dr. Jacques",
        address: "Rue de la medecine, 20",
        mail: "dr.jacques@mail.be",
        password: "azerty1.",
        is_doctor: true
    })
]

const locations = [
    new FacilityLocation({
        facility_id: professionals[0]._id,
        name: "Local 27",
        description: "Le fameux local 27 de l'IPL.",
        avg_time: "1h"
    }),
    new FacilityLocation({
        facility_id: professionals[0]._id,
        name: "Local 28",
        description: "Le petit local 28 de l'IPL.",
        avg_time: "2h"
    })
]

const qrcodes = [
    new QRCode({
        doctor_id: professionals[1]._id,
        location_id: null
    }),
    new QRCode({
        doctor_id: null,
        location_id: locations[0]._id
    }),
    new QRCode({
        doctor_id: null,
        location_id: locations[0]._id
    })
]

const qrcode_doctor = qrcodes[0]._id
const qrcode_local27 = qrcodes[1]._id
const qrcode_local28 = qrcodes[2]._id

const scans = [
    //////////////////////////////////////////////////////////////
    //                          JEAN                            //
    //////////////////////////////////////////////////////////////
    {
        citizen_id: jean,
        qrcode_id: qrcode_local27,
        date_time: Date.UTC(2020, 1, 1, 8, 30)
    },
    {
        citizen_id: jean,
        qrcode_id: qrcode_local27,
        date_time: Date.UTC(2020, 1, 1, 10, 30)
    },
    {
        citizen_id: jean,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 12)
    },
    {
        citizen_id: jean,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 14)
    },

    //////////////////////////////////////////////////////////////
    //                         HILDE                            //
    //////////////////////////////////////////////////////////////
    {
        citizen_id: hilde,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 8, 30)
    },
    {
        citizen_id: hilde,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 10, 30)
    },
    {
        citizen_id: hilde,
        qrcode_id: qrcode_local27,
        date_time: Date.UTC(2020, 1, 1, 12)
    },
    {
        citizen_id: hilde,
        qrcode_id: qrcode_local27,
        date_time: Date.UTC(2020, 1, 1, 14)
    },

    //////////////////////////////////////////////////////////////
    //                    JESSICA ET MARCO                      //
    //////////////////////////////////////////////////////////////
    {
        citizen_id: jessica,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 12)
    },
    {
        citizen_id: jessica,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 14)
    },
    {
        citizen_id: marco,
        qrcode_id: qrcode_local28,
        date_time: Date.UTC(2020, 1, 1, 12)
    },

    //////////////////////////////////////////////////////////////
    //                          THOMAS                          //
    //////////////////////////////////////////////////////////////
    {
        citizen_id: thomas,
        qrcode_id: qrcode_local27,
        date_time: Date.UTC(2020, 1, 1, 10)
    },
    {
        citizen_id: thomas,
        qrcode_id: qrcode_local27,
        date_time: Date.UTC(2020, 1, 1, 12)
    },

    //////////////////////////////////////////////////////////////
    // Jean gets his results back at the doctor's office        //
    //////////////////////////////////////////////////////////////
    {
        citizen_id: jean,
        qrcode_id: qrcode_doctor,
        date_time: Date.UTC(2020, 1, 1, 20)
    },
]

module.exports = {
    citizens,
    professionals,
    locations,
    qrcodes,
    scans
}


