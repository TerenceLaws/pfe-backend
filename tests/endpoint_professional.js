const app = require("../src");
const Professional = require("../models/professional")
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp)

describe("Tests related to the endpoint /professionals", () => {
    let initialAmountOfProfessionals;

    const testProfessionals = [
        {
            name: "Facility#1",
            address: "Rue de la paix, 23",
            mail: "jess@mail.com",
            password: "azerty1.",
            is_doctor: false
        },
        {
            name: "Doctor#1",
            address: "Rue de la medecine, 89",
            mail: "doctor@mail.com",
            password: "azerty1.",
            is_doctor: true
        },
    ]

    before(function(done) {
        // Clear DB from all professionals
        Professional.collection.deleteMany({})

        // Add 2 initial, default professionals
        Professional.collection.insertOne(testProfessionals, function(err) {
            if(err) return console.error(err)
        })

        initialAmountOfProfessionals = testProfessionals.length
        done()
    })

    describe("GET /professional", function() {
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
        it("add a new facility to db", function (done) {
            chai.request(app)
                .post("/professionals/register")
                .set('content-type', 'application/json')
                .send({
                    name: "Facility#2",
                    address: "Rue de la loi, 47",
                    mail: "test@mail.be",
                    password: "qwerty2.",
                    is_doctor: false})
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfProfessionals + 1)

                    done()
                })
        })


        it("effectively added new facility", function (done) {
            chai.request(app)
                .get("/professionals")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfProfessionals + 1)

                    done()
                })
        })

        it("try to add a new facility to db with mail already used", function (done) {
            chai.request(app)
                .post("/professionals/register")
                .set('content-type', 'application/json')
                .send({
                    name: "Facility#3",
                    address: "Rue du test, 165",
                    mail: "test@mail.be",
                    password: "undeuxTest56.",
                    is_doctor: false})
                .end((err, res) => {
                    res.should.have.status(409)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfProfessionals)

                    done()
                })
        })


        it("effectively not added new facility", function (done) {
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
                .send({
                    mail: "notInDb@mail.be",
                    password: "undeuxTest56."})
                .end((err, res) => {
                    res.should.have.status(401)

                    done()
                })
        })

        it("try to login with mail in db", function (done) {
            chai.request(app)
                .post("/professionals/login")
                .set('content-type', 'application/json')
                .send({
                    mail: "test@mail.be",
                    password: "qwerty2."})
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })
    })
})