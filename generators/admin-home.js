var models = require('../../models')
var errors = require('node-errors')

exports.configure = function(app) {

  app.get('/', function(req, res, next) {
    res.render('index')
  })

}
