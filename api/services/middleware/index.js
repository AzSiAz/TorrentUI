const auth = require('http-auth')
const multer = require('multer');
const { extname } = require('path');
const mime = require('mime');
const { pseudoRandomBytes } = require('crypto');

const { verifyToken, parseTokenString } = require('../../utils/token')

/**
 * Upload middleware
 */
const upload = multer({
  storage: multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, './../../data/torrents');
      },
      filename: function (req, file, cb) {
          let ext = extname(file.originalname);
          ext = ext.length > 1 ? ext : "." + mime.extension(file.mimetype);
          pseudoRandomBytes(16, function (err, raw) {
              cb(null, (err ? undefined : raw.toString('hex') ) + ext);
          });
      }
  })
})

/**
 * Login Required middleware.
 */
const isAuthenticated = (req, res, next) => {
  // type Bearer
  let token = req.get('Authorization')
  if (!token) {
    res.status(400).json({
      status: 'Error',
      message: 'No Token'
    })
  }
  token = parseTokenString(token)

  if (verifyToken(token))
    next()
  else 
    res.status(400).json({
      status: 'Error',
      message: 'Not Authenticated or wrong/expired token'
    })
}

const populateUser = (req, res, next) => {
  const token = parseTokenString(req.get('Authorization'))
  req.Users.findOne({ tokens: token }).then((user) => {
    req.user = user
    next()
  }).catch((e) => {
    res.status(500).json({
      status: 'Error',
      message: 'Something happened'
    })
  })
}

/**
 * Authorization Required middleware.
 */
const isAuthorized = (rank = 'Member') => (req, res, next) => {
  
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
  basicAuth,
  populateUser
}
