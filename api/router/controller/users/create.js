const isMail = require('isemail')
const { sendSignUpEmail } = require('../../../services/mail')

module.exports = createAccount = async (req, res) => {
  const { 
    password,
    confirmPassword,
    email,
    username,
    gender,
    name
  } = req.body
  if (password !== confirmPassword) 
    throw new Error('Password is not the same')
  if (!isMail.validate(email))
    throw new Error('Incorrect or empty email')
  if (username === '' || username === undefined)
    throw new Error('Username or Gender incorrect')

  const userObj = {
    email: email,
    password: password,
    profile: {
      username: username,
      gender: gender
    }
  }

  if (name) 
    userObj.profile.name = name
  
  const existingUserEmailPromise = req.Users.findOne({ email: email }).exec()
  const existingUserUsernamePromise = req.Users.findOne({ 'profile.username': username }).exec()

  const [
    existingUserEmail,
    existingUserUsername 
  ] = await Promise.all([existingUserEmailPromise, existingUserUsernamePromise])

  if (existingUserEmail || existingUserUsername) {
    res.status(400).json({
      error: 'An user with the same email and/or Username already exist'
    })
    return
  }

  try {
    const user = new req.Users(userObj)
    await user.save()
    sendSignUpEmail({ host: req.headers.host, user: user }).catch(console.error)
    res
      .json({
        status: 'Done',
        message: 'User created, please active your account by checking your mail'
      })
  } catch (error) {
    res
      .status(400)
      .json({
        status: 'Error',
        error: 'Something happen while trying to create new user please try again or contact an adminitrator'
      })
  }
}
