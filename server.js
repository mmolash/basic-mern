const express = require('express')
const mongoose = require("mongoose")
const credentials = require("./credentials")
const Data = require("./data")

const app = express()
const port = 5000


mongoose.connect(credentials.dbRoute, {useNewUrlParser: true})
let db = mongoose.connection

db.once("open", () => console.log("Connected to the database."))
db.on("error", console.error.bind(console, "MongoDB connection error:"))


app.get('/api_call', (req, res) => res.send({message: 'Hello World!'}))

app.listen(port, () => console.log(`Listening on port ${port}.`))
