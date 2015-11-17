var models = require('../models')
var txain = require('txain')
var errors = require('node-errors')

exports.configure = function(app) {

  app.get('/', function(req, res, next) {
    res.render('index')
  })

}
