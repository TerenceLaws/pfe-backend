const app = require("../src");
const Citizen = require("../models/citizen")
const config = require("./configuration");
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("Tests related to the endpoint /citizens", () => {
    let initialAmountOfCitizens;

    before(function(done) {
        // Clear DB from all citizens
         Citizen.collection.deleteMany({})

        // Add initial citizens
        Citizen.collection.insertMany(config.testCitizens)
            .then(() => {
                initialAmountOfCitizens = config.testCitizens.length;
                done()
            })
            .catch((err) => {console.error(err)})
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
        it("create and add new citizen", function (done){
            chai.request(app)
                .post("/citizens")
                .set('content-type', 'application/json')
                .send(config.testAddCitizen)
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('object')
                    done()
                })
        })

        it("verify new citizen added", function (done){
            chai.request(app)
                .get("/citizens")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(++initialAmountOfCitizens)

                    done()
                })
        })
    })
});