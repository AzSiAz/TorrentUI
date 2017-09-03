require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const compression = require('compression')
const log = require('debug')('APP')

const apiRouter = require('./router/api')
const { initDatabase, getCollection } = require('./database')
const { injectModel, expressLogger } = require('./services/middleware')

const envBool = process.env.NODE_ENV === 'test'

const listen = () => {
  /*
  Init Express
  */
  const app = express()
  /*
  Middleware
  */
  app.use(expressLogger(envBool, log))
  app.use(compression())
  app.use(helmet())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('./../web/dist'))
  
  const { News, Torrents, Users } = getCollection()
  app.use(injectModel({ Users, News, Torrents }))

  /*
    Define route
  */
  app.use('/api', apiRouter)

  /*
    Listen on port
  */
  const port = process.env.PORT || 8081
  app.listen(port)
  log(`Listening on ${port}`)
}

const init = async () => {
  /*
    Init Database
  */
  const connection = initDatabase()

  connection
    .on('error', log)
    .on('disconnected', initDatabase)
    .once('open', listen)
}


init().catch(console.error)
