const app = require("../src");
const FacilityLocation = require("../models/location")
const config = require("./endpoint_configuration");

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
        .then(() => {
            return FacilityLocation.collection.insertMany(config.testLocations)
        })
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
                .set("authorization" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MjY3OTUsImV4cCI6MTYwNzYxMzE5NX0.ViAS_l228_GBob2B3GAUWXvj4dbTCMi7ECdtVapau0w")
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
                .set("authorization" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc1MjY3OTUsImV4cCI6MTYwNzYxMzE5NX0.ViAS_l228_GBob2B3GAUWXvj4dbTCMi7ECdtVapau0w")
                .end((err, res) => {
                    res.should.have.status(200)

                    expect(res.body).to.be.a('array')
                    expect(res.body).to.have.lengthOf(++initialAmountOfLocations)

                    done()
                })
        })
    })
})