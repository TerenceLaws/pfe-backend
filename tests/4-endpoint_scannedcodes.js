const app = require("../src");
const ScannedCode = require("../models/scannedCode")
const config = require("./endpoint_configuration");

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("Tests related to the endpoint /scannedcodes", () => {
    let initialAmountOfScannedCodes

    before(function(done) {
        // Clear DB from all scannedcodes
        ScannedCode.collection.deleteMany({})

        // Add initial ScannedCodes
        ScannedCode.collection.insertMany(config.testScannedCodes)
            .then(() => {
                initialAmountOfScannedCodes = config.testScannedCodes.length
                done()
            })
            .catch((err) => {
                console.error(err)
            })
    })

    describe("GET /scannedcodes", function() {
        it("return a list of all scanned codes", function (done) {
            chai.request(app)
                .get("/scannedcodes")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfScannedCodes)

                    done()
                })
        })
    })

    describe("POST /scannedcodes", function () {
        it("create and add a new scanned code", function (done) {
            chai.request(app)
                .post("/scannedcodes")
                .set('content-type', 'application/json')
                .send(config.testAddScannedCode)
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })

        it("verify new scannedcode added", function (done) {
            chai.request(app)
                .get("/scannedcodes")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(++initialAmountOfScannedCodes)

                    done()
                })
        })

        it("create and add a new scanned code with citizen_id not in db should fail", function (done) {
            chai.request(app)
                .post("/scannedcodes")
                .set('content-type', 'application/json')
                .send(config.testAddScannedCodeNotInDb)
                .end((err, res) => {
                    res.should.have.status(500)

                    done()
                })
        })
    })
})