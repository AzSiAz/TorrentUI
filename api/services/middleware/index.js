const auth = require('http-auth')
const { getCollection } = require('../../database')

const { Users } = getCollection()

/**
 * Login Required middleware.
 */
const isAuthenticated = (req, res, next) => {

}

/**
 * Authorization Required middleware.
 */
const isAuthorized = (req, res, next) => {
  
}


const ownTorrent = (req, res, next) => {

}

const injectModel = (models) => (req, res, next) => {
  for(let model in models) {
    req[model] = models[model]
  }

  next()
}

const basicAuth = () => {
  const basic = auth.basic({realm: 'Monitor Area'}, function(user, pass, callback) {
    callback(user === 'username' && pass === 'password');
  });

  return auth.connect(basic)
}

expressLogger = (skip, log) => (req, res, next) => {
  if (skip) return next()

  log(`${req.method} ${req.path} ${res.statusCode}`)
  next()
}

module.exports = { 
  isAuthenticated,
  isAuthorized,
  ownTorrent,
  injectModel,
  expressLogger,
  basicAuth
}
