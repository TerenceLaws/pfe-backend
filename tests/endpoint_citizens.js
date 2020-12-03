const app = require("../src");
const Citizen = require("../models/citizen")
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp)

describe("Tests related to the endpoint /citizens", () => {
    let initialAmountOfCitizens;

    const testCitizens = [{}, {}]

    before(function(done) {
        // Clear DB from all citizens
         Citizen.collection.deleteMany({})

        // Add 2 initial, default citizens
        Citizen.collection.insertMany(testCitizens, function (err){
            if(err) return console.error(err)
        })

        initialAmountOfCitizens = testCitizens.length;
        done()
    });

    describe("GET /citizens", function() {
        it("return a list of all citizens", function(done) {
            chai.request(app)
                .get("/citizens")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfCitizens)

                    done()
                })
        });
    });

    describe("POST /citizens", function (){
        it("add a new user to db", function (done){
            chai.request(app)
                .post("/citizens")
                .end((err, res) => {
                    res.should.have.status(200)

                    done()
                })
        })

        it("effectively added new citizen", function (done){
            chai.request(app)
                .get("/citizens")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfCitizens + 1)

                    done()
                })
        })
    })
});