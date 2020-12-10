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
const Scan = require("../models/scan")
const mongoose = require("mongoose")

const citizens = [
    new Citizen({
        id: mongoose.Types.ObjectId()
    }),    // 0: Jessica
    new Citizen({
        id: mongoose.Types.ObjectId()
    }),    // 1: Marco
    new Citizen({
        id: mongoose.Types.ObjectId()
    }),    // 2: Jean
    new Citizen({
        id: mongoose.Types.ObjectId()
    }),    // 3: Thomas
    new Citizen({
        id: mongoose.Types.ObjectId()
    }),    // 4: Hilde
]

const jessica = citizens[0].id
const marco = citizens[1].id
const jean = citizens[2].id
const thomas = citizens[3].id
const hilde = citizens[4].id

console.log("jessica", jessica)
console.log("marco", marco)
console.log("jean", jean)
console.log("thomas", thomas)
console.log("hilde", hilde)

const professionals = [
    new Professional({
        id: mongoose.Types.ObjectId(),
        name: "Institut Paul-Lambin",
        address: "Clos Chapelle-aux-Champs, 43",
        mail: "support@vinci.be",
        password: "azerty1.",
        is_doctor: false
    }),
    new Professional({
        id: mongoose.Types.ObjectId(),
        name: "Dr. Jacques",
        address: "Rue de la medecine, 20",
        mail: "dr.jacques@mail.be",
        password: "azerty1.",
        is_doctor: true
    })
]

const locations = [
    new FacilityLocation({
        id: mongoose.Types.ObjectId(),
        facility_id: professionals[0].id,
        name: "Local 27",
        description: "Le fameux local 27 de l'IPL.",
        max_time: "2h"
    }),
    new FacilityLocation({
        id: mongoose.Types.ObjectId(),
        facility_id: professionals[0].id,
        name: "Local 28",
        description: "Le petit local 28 de l'IPL.",
        max_time: "5h"
    })
]

const qrcodes = [
    new QRCode({
        id: mongoose.Types.ObjectId(),
        doctor_id: professionals[1].id,
        location_id: null
    }),
    new QRCode({
        id: mongoose.Types.ObjectId(),
        doctor_id: null,
        location_id: locations[0].id
    }),
    new QRCode({
        id: mongoose.Types.ObjectId(),
        doctor_id: null,
        location_id: locations[1].id
    })
]

const qrcode_doctor = qrcodes[0].id
const qrcode_local27 = qrcodes[1].id
const qrcode_local28 = qrcodes[2].id

const scans = [
    //////////////////////////////////////////////////////////////
    //                          JEAN                            //
    //////////////////////////////////////////////////////////////
    new Scan({
        citizen_id: jean,
        qrcode_id: qrcode_local27,
        entry_date: Date.UTC(2020, 0, 1, 8, 30)
    }),
    new Scan({
        citizen_id: jean,
        qrcode_id: qrcode_local27,
        entry_date: Date.UTC(2020, 0, 1, 10, 30)
    }),
    new Scan({
        citizen_id: jean,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 12)
    }),
    new Scan({
        citizen_id: jean,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 14)
    }),

    //////////////////////////////////////////////////////////////
    //                         HILDE                            //
    //////////////////////////////////////////////////////////////
    new Scan({
        citizen_id: hilde,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 8, 30)
    }),
    new Scan({
        citizen_id: hilde,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 10, 30)
    }),
    new Scan({
        citizen_id: hilde,
        qrcode_id: qrcode_local27,
        entry_date: Date.UTC(2020, 0, 1, 12)
    }),
    new Scan({
        citizen_id: hilde,
        qrcode_id: qrcode_local27,
        entry_date: Date.UTC(2020, 0, 1, 14)
    }),

    //////////////////////////////////////////////////////////////
    //                    JESSICA ET MARCO                      //
    //////////////////////////////////////////////////////////////
    new Scan({
        citizen_id: jessica,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 12)
    }),
    new Scan({
        citizen_id: jessica,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 14)
    }),
    new Scan({
        citizen_id: marco,
        qrcode_id: qrcode_local28,
        entry_date: Date.UTC(2020, 0, 1, 12)
    }),

    //////////////////////////////////////////////////////////////
    //                          THOMAS                          //
    //////////////////////////////////////////////////////////////
    new Scan({
        citizen_id: thomas,
        qrcode_id: qrcode_local27,
        entry_date: Date.UTC(2020, 0, 1, 10)
    }),
    new Scan({
        citizen_id: thomas,
        qrcode_id: qrcode_local27,
        entry_date: Date.UTC(2020, 0, 1, 12)
    }),

    //////////////////////////////////////////////////////////////
    // Jean gets his results back at the doctor's office        //
    //////////////////////////////////////////////////////////////
    new Scan({
        citizen_id: jean,
        qrcode_id: qrcode_doctor,
        entry_date: Date.UTC(2020, 0, 1, 20)
    })
]

const expectedUniqueScanLogs = 7

module.exports = {
    citizens,
    professionals,
    locations,
    qrcodes,
    scans,
    expectedUniqueScanLogs
}


