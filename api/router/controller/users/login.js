module.exports = login = async (req, res) => {
  res.json({
    username: req.body.username,
    password: req.body.password
  })
}
