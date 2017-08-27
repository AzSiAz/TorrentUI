const nodemailer = require('nodemailer')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const log = require('debug')('APP:Service:Mail')

const SendGridUser = process.env.SENDGRIDUSER
const SendGridPassword = process.env.SENDGRIDPASSWORD
const fromEmail = process.env.FROMEMAIL

const randomBytesAsync = promisify(randomBytes)

const mailTransporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
      user: SendGridUser,
      pass: SendGridPassword
  }
})

const forgotMailContent = ({ token, host, to }) => {
  return {
    to: to,
    from: fromEmail,
    subject: 'Reset your password on TorrentUI',
    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    http://${req.headers.host}/account/password/reset?token=${token}&email=${to}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`
  }
}

const signUpMailContent = ({ token, host, to }) => {
  return {
    to: to,
    from: fromEmail,
    subject: 'TorrentUI Account Activation',
    text: `You are receiving this email because you (or someone else) just signup on ${host}.\n\n
    Follow the instruction bellow to activate your account\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    http://${req.headers.host}/account/activate?token=${token}&email=${to}\n\n
    If you did not request this, please ignore this email and this account will just disapear after a while.\n`
  }
}

const createRandomToken = randomBytesAsync(16).then(buf => buf.toString('hex'))

// const setRandomToken = (token, req) =>
//   User.findOne({ email: req.body.email })
//     .then((user) => {
//         if (!user) {
//             req.flash('errors', { msg: 'Account with that email address does not exist.' })
//         } else {
//             user.passwordResetToken = token
//             user.passwordResetExpires = Date.now() + 3600000 * 3 // 1 hour
//             user = user.save()
//         }

//         return user
//     })

const sendForgotEmail = async (user) => {

}

const sendSignUpEmail = async ({ user, host }) => {
  const token = await createRandomToken()
  const option = signUpMailContent({ 
    to: user.email, 
    token: token,
    host: host
  })

  await user.setActivationToken(token)

  return mailTransporter.sendMail(option)
}

module.exports = {
  sendForgotEmail,
  sendSignUpEmail
}
