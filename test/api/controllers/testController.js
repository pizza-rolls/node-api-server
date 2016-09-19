module.exports = {
  index: (req, res, next) => {
    return res.end('index method')
  },

  testMethod: (req, res, next) => {
    return res.end('testMethod!')
  }
}
