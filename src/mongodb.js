const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pfe", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        if(process.env.NODE_ENV === "dev") console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ', error.message)
    })

module.exports = mongoose;