module.exports = (req, res, next) => {
  res.set({
    'isAdmin': true
  })
  next()
}
