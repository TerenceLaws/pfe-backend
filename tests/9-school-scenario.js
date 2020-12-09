const app = require("../src");
const config = require("./scenario_configuration")

const Citizen = require("../models/citizen")
const Professional = require("../models/professional")
const FacilityLocation = require("../models/location")
const QRCode = require("../models/qrCode")
const Scan = require("../models/scan")

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("TESTING SCENARIO: SCHOOL & STUDENTS", () => {

    before(function (done) {
        // Clear DB from all data
        Citizen.collection.deleteMany({})
        .then(() => {
            return Professional.collection.deleteMany({})
        })
        .then(() => {
            return FacilityLocation.collection.deleteMany({})
        })
        .then(() => {
            return QRCode.collection.deleteMany({})
        })
        .then(() => {
            return Scan.collection.deleteMany({})
        })
        .then(() => {
            done()
        })
        .catch(err => {
            console.error(err)
        })
    });

    describe("Testing endpoint /citizens", function() {
        it("adds citizens using POST /citizens", function(done) {
            config.citizens.forEach(function (citizen){
                chai.request(app)
                    .post("/citizens")
                    .set('content-type', 'application/json')
                    .send(citizen)
                    .end((err, res) => {
                        res.should.have.status(200)

                        // Call done() only after having added the last citizen.
                        if(citizen === config.citizens[config.citizens.length - 1]) done()
                    })
                })
        });

        it("checks if added all citizens using GET /citizens", function(done) {
            chai.request(app)
                .get("/citizens")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(config.citizens.length)

                    done()
                })
        });
    });

    describe("Testing endpoint /professionals", function() {
        it("adds professionals using POST /professionals", function(done) {
            config.professionals.forEach(function (professional){
                chai.request(app)
                    .post("/professionals/register")
                    .set('content-type', 'application/json')
                    .send(professional)
                    .end((err, res) => {
                        res.should.have.status(200)

                        // Call done() only after having added the last professional.
                        if(professional === config.professionals[config.professionals.length - 1]) done()
                    })
            })
        });

        it("checks if added all professionals using GET /professionals", function(done) {
            chai.request(app)
                .get("/professionals")
                .set("authorization" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MjY3OTUsImV4cCI6MTYwNzYxMzE5NX0.ViAS_l228_GBob2B3GAUWXvj4dbTCMi7ECdtVapau0w")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(config.professionals.length)

                    done()
                })
        });
    });

    describe("Testing endpoint /professionals/locations", function() {
        it("adds locations using POST /professionals/locations", function(done) {
            config.locations.forEach(function (location){
                chai.request(app)
                    .post("/professionals/locations")
                    .set('content-type', 'application/json')
                    .send(location)
                    .end((err, res) => {
                        res.should.have.status(200)

                        // Call done() only after having added the last location.
                        if(location === config.locations[config.locations.length - 1]) done()
                    })
            })
        });

        it("checks if added all locations using GET /professionals/locations", function(done) {
            chai.request(app)
                .get("/professionals/locations")
                .set("authorization" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MjY3OTUsImV4cCI6MTYwNzYxMzE5NX0.ViAS_l228_GBob2B3GAUWXvj4dbTCMi7ECdtVapau0w")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(config.locations.length)

                    done()
                })
        });
    });

    describe("Testing endpoint /qrcodes", function() {
        it("adds locations using POST /qrcodes", function(done) {
            config.qrcodes.forEach(function (qrcode){
                chai.request(app)
                    .post("/qrcodes/insert")
                    .set('content-type', 'application/json')
                    .send(qrcode)
                    .end((err, res) => {
                        res.should.have.status(200)

                        // Call done() only after having added the last qrcode.
                        if(qrcode === config.qrcodes[config.qrcodes.length - 1]) done()
                    })
            })
        });

        it("checks if added all locations using GET /qrcodes", function(done) {
            chai.request(app)
                .get("/qrcodes")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(config.qrcodes.length)

                    done()
                })
        });
    });

    describe("Testing endpoint /qrcodes/scan", function() {
        it("adds QR Code scans using POST /qrcodes/scan", function(done) {
            // Change Mocha timeout, this request is longer than others because it performs multiple POSTs.
            this.timeout(Math.max(config.scans.length * 500, 2000))
            // Interval at which the POST requests are done. (default: 500)
            let interval = 500

            config.scans.forEach(function (scan, index){
                setTimeout(function(){
                    chai.request(app)
                        .post("/qrcodes/scan")
                        .set('content-type', 'application/json')
                        .send(scan)
                        .end((err, res) => {
                            res.should.have.status(200)

                            // Call done() only after having added the last scan.
                            if(scan === config.scans[config.scans.length - 1]) done()
                        })
                }, index*interval)
            })
        });

        it("checks if added all locations using GET /scannedcodes", function(done) {
            this.timeout(2000)
            chai.request(app)
                .get("/scannedcodes")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(config.expectedUniqueScanLogs)

                    done()
                })
        });
    });
})