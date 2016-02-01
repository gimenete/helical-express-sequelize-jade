var http = require('http')
var express = require('express')
var path = require('path')
var fs = require('fs')
var querystring = require('querystring')
var errors = require('node-errors')

require('dotenv').config()

var app = exports.app = express()

app.disable('x-powered-by')
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('body-parser').urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(require('cookie-session')({
  secret: process.env.COOKIE_SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}))

var dirs = ['', 'api', 'admin', 'auth']
dirs.forEach(function(dir) {
  dir = path.join(__dirname, 'controllers', dir)
  fs.readdirSync(dir).forEach(function(file) {
    if (file.endsWith('.js')) {
      var m = require(path.join(dir, file))
      if (m.configure) {
        m.configure(app)
      }
    }
  })
})

app.use(function(req, res) {
  res.status(404).render('404')
})

app.use(function(err, req, res, next) {
  if (errors.isCustomError(err)) {
    if (err.isForbidden()) {
      res.status(403)
    } else if (err.isNotFound()) {
      res.status(404)
    } else {
      res.status(500)
    }
  }
  console.log(err, err.stack)
  res.send('Error: '+err.message)
})

if (module.id === require.main.id) {
  var port = process.env.PORT
  http.createServer(app).listen(port)
  console.log('Started server at port %d', port)
}
