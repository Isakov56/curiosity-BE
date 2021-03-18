const express = require('express')
const cors = require('cors')
const listEndpoint = require('express-list-endpoints')
const { join } = require("path")
const usersRouter = require('./services/users')
const mongoose = require('mongoose')
const {
    notFoundHandler,
    forbiddenHandler,
    badRequestHandler,
    genericErrorHandler,
} = require("./errorHandlers")


const server = express()

server.use(cors())

const port = process.env.PORT || 3006

const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

server.use('/users', usersRouter)

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