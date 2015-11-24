var limit = 50

module.exports = function(req, res, next) {
  var page = +req.query.page || 1
  req.pagination = {
    page: page,
    limit: limit,
    offset: limit*(page-1),
    pages: function(count) {
      return Math.max(1, Math.ceil(count / limit))
    }
  }
  next()
}
