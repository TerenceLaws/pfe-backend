const app = require("../src");
const QRCode = require("../models/qrCode")
const ScannedCode = require("../models/scannedCode")
const config = require("./configuration")

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("Tests related to the endpoint /qrcodes", () => {
    let initialAmountOfQRCodes;

    before(function (done) {
        // Clear DB from all QRCodes
        QRCode.collection.deleteMany({})

        // Add initial QRCodes
        QRCode.collection.insertMany(config.testQRCodes)
            .then(() => {
                initialAmountOfQRCodes = config.testQRCodes.length;
                done()
            })
            .catch((err) => {console.error(err)})
    });

    describe("GET /qrcodes", function () {
        it("return a list of all QR Codes", function (done) {
            chai.request(app)
                .get("/qrcodes")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfQRCodes)

                    done()
                })
        });
    });

    describe("POST /qrcodes", function () {
        it("create and add new QR Code", function (done) {
            chai.request(app)
                .post("/qrcodes/insert")
                .set('content-type', 'application/json')
                .send(config.testAddQRCode)
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })

        it("verify new QR Code added", function (done){
            chai.request(app)
                .get("/qrcodes")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(++initialAmountOfQRCodes)

                    done()
                })
        })

        it("scanning a non-doctor QR code adds an entry to endpoint /qrcodescanned", function (done){
            chai.request(app)
                .post("/qrcodes/scan")
                .set('content-type', 'application/json')
                .send(config.scanNonDoctorQRCode)
                .end((err, res) => {
                    res.should.have.status(200)

                    ScannedCode.find({
                        citizen_id: config.scanNonDoctorQRCode.citizen_id,
                        qrcode_id: config.scanNonDoctorQRCode.qrcode_id
                    }).then(result => {
                        expect(result).to.be.a('array')
                        expect(result).to.have.lengthOf(1)

                        done()
                    })
                })
        })

        it("scanning a doctor QR code returns a list of IDs to notify", function (done){
            chai.request(app)
                .post("/qrcodes/scan")
                .set('content-type', 'application/json')
                .send(config.scanDoctorQRCode)
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')

                    done()
                })
        })
    })
})