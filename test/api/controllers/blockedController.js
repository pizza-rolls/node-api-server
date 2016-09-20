module.exports = {
  index: (req, res, next) => {
    return res.end('notAvailableEndpoint')
  },

  notAvailableEndpoint: (req, res, next) => {
    return res.end('notAvailableEndpoint')
  }
}
