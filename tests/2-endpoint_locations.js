const app = require("../src");
const FacilityLocation = require("../models/location")
const config = require("./configuration");
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("Tests related to the endpoint /professionals/locations", () => {
    let initialAmountOfLocations;

    before(function (done) {
        // Clear DB from all Locations
        FacilityLocation.collection.deleteMany({})

        // Add initial Locations
        FacilityLocation.collection.insertMany(config.testLocations)
            .then(() => {
                initialAmountOfLocations = config.testLocations.length;
                done()
            })
            .catch((err) => {console.error(err)})
    });

    describe("GET /professionals/locations", function () {
        it("return a list of all locations", function (done) {
            chai.request(app)
                .get("/professionals/locations")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(initialAmountOfLocations)

                    done()
                })
        });
    });

    describe("POST /professionals/locations", function () {
        it("create and add new location", function (done) {
            chai.request(app)
                .post("/professionals/locations")
                .set('content-type', 'application/json')
                .send(config.testAddLocation)
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.not.be.null

                    done()
                })
        })

        it("verify new location added", function (done){
            chai.request(app)
                .get("/professionals/locations")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(++initialAmountOfLocations)

                    done()
                })
        })
    })
})