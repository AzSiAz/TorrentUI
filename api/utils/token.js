const { sign, verify, TokenExpiredError } = require('jsonwebtoken')

const JWT_SECRET = process.env.JWTSECRET
const token_expiry = '1h'

const signToken = (toSign) => {
  return sign(toSign, JWT_SECRET, { expiresIn: token_expiry, algorithm: [ 'HS512' ] })
}

const verifyToken = token => {
  try {
    const verified = verify(token, JWT_SECRET, { algorithms: [ 'HS512' ] })
    return verified ? true : false
  } catch(e) {
    return false
  }
}

const parseTokenString = str => {
  return str.replace('Bearer ', '')
}

module.exports = {
  signToken,
  verifyToken,
  parseTokenString
}
