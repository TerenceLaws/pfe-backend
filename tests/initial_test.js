const request = require("supertest");
const app = require("../index");

describe("GET /", () => {
    it("Respond with Hello World", (result) => {
        request(app).get("/").expect("Hello World", result);
    })
});