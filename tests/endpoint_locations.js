const app = require("../src");
const FacilityLocation = require("../models/location")
require('dotenv').config()

const chai = require("chai");
const chaiHttp = require("chai-http")
const expect = chai.expect;

chai.use(chaiHttp)
chai.should();

describe("Tests related to the endpoint /professionals/locations", () => {
    let initialAmountOfLocations;

    const testLocations = [
        new FacilityLocation({
            facility_id: "123",
            name: "Location Alpha",
            description: "Description for Location Alpha",
            interval: "1h"
        }),
        new FacilityLocation({
            facility_id: "456",
            name: "Location Zulu",
            description: "Description for Location Zulu",
            interval: "2h"
        })
    ]

    before(function (done) {
        // Clear DB from all Locations
        FacilityLocation.collection.deleteMany({})

        // Add initial Locations
        FacilityLocation.collection.insertMany(testLocations, function (err) {
            if (err) return console.error(err)
        })

        initialAmountOfLocations = testLocations.length;
        done()
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
})