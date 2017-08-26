const mongoose = require('mongoose')
const log = require('debug')('APP:Database')

const UsersModel = require('./users.schema')
const NewsModel = require('./users.schema')
const TorrentsModel = require('./users.schema')

let News, Users, Torrents;

const initDatabase = () => {
  const uri = process.env.MONGO_URI

  log('Injecting model inside mongoose')
  Users = UsersModel
  News = NewsModel
  Torrents = TorrentsModel
  log('Done Injecting model inside mongoose')
  
  let options = { useMongoClient: true };
  mongoose.Promise = global.Promise
  
  log('Connecting to Database')
  const connection = mongoose.connect(uri, options)
  connection.once('open', () => log('Done connecting to database'))

  return connection
}

const getCollection = () => {
  return {
    News,
    Users,
    Torrents
  }
}

module.exports = { initDatabase, getCollection }
