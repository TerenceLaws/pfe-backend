const express = require("express");
const app = express();

app.get("/", function (req, res) {
    return res.send("Hello World");
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running!");
});

module.exports = app;