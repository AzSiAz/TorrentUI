// TODO redirect to preact page instead of plain text message
module.exports = activateAccount = async (req, res, next) => {
  const { token, email } = req.query
  const user = await req.Users.findOne({ email: email, activationToken: token })

  if(!user) {
    res.status(400).send('ERROR')
    return
  }

  try {
    await user.activateUser()
  } catch (error) {
    res.status(500).send(`Something happened try again or contact an administrator if it's still not working`)
  }

  res.redirect('/')
}
