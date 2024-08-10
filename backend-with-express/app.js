const express = require("express")
const bankAccountRouter = require("./routes/account.route.js")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())

// defining the restful api.

app.use("/api", bankAccountRouter)

module.exports = app