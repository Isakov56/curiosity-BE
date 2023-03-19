const express = require('express')
const cors = require('cors')
const listEndpoint = require('express-list-endpoints')
const { join } = require("path")
const services = require("./services");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose')
const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler,
} = require("./errorHandlers")

const server = express()

server.use(cors())
server.use(cookieParser());

const port = process.env.PORT || 3006

const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

server.use("/api", services);

server.use(badRequestHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoint(server))

mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))