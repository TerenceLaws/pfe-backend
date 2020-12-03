const app = require("../src");
const QRCode = require("../models/qrCode")
const config = require("./configuration");
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("Tests related to the endpoint /professionals/locations", () => {
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
                .post("/qrcodes")
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
    })
})