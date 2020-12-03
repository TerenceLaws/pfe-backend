const app = require("../src");
const Professional = require("../models/professional")
const config = require("./configuration");
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp)

describe("Tests related to the endpoint /professionals", () => {
    let initialAmountOfProfessionals;

    before(function(done) {
        // Clear DB from all professionals
        Professional.collection.deleteMany({})

        // Add 2 initial, default professionals
        Professional.collection.insertMany(config.testProfessionals)
            .then(() => {
                initialAmountOfProfessionals = config.testProfessionals.length
                done()
            })
            .catch(err => {
                return console.error(err)
            })
    })

    describe("GET /professionals", function() {
        it("return a list of all professionals", function(done) {
            chai.request(app)
                .get("/professionals")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfProfessionals)

                    done()
                })
        })
    })

    describe("POST /professionals/register", function () {
        it("create and add a new facility", function (done) {
            chai.request(app)
                .post("/professionals/register")
                .set('content-type', 'application/json')
                .send(config.testAddProfessional)
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })


        it("verify new facility added", function (done) {
            chai.request(app)
                .get("/professionals")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(++initialAmountOfProfessionals)

                    done()
                })
        })

        it("adding new facility with already used mail should fail", function (done) {
            chai.request(app)
                .post("/professionals/register")
                .set('content-type', 'application/json')
                .send(config.professionalAlreadyUsedMail)
                .end((err, res) => {
                    res.should.have.status(409)

                    done()
                })
        })


        it("verify new facility not added", function (done) {
            chai.request(app)
                .get("/professionals")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfProfessionals)

                    done()
                })
        })
    })

    describe("POST /professionals/login", function () {
        it("try to login with mail not in db", function (done) {
            chai.request(app)
                .post("/professionals/login")
                .set('content-type', 'application/json')
                .send(config.professionalWrongMail)
                .end((err, res) => {
                    res.should.have.status(401)

                    done()
                })
        })

        it("try to login with mail in db", function (done) {
            chai.request(app)
                .post("/professionals/login")
                .set('content-type', 'application/json')
                .send(config.professionalLoginSuccess)
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })
    })
})