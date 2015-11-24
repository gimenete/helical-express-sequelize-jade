var http = require('http')
var express = require('express')
var path = require('path')
var fs = require('fs')
var querystring = require('querystring')
var errors = require('node-errors')

var app = exports.app = express()

app.disable('x-powered-by')
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('body-parser').urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(require('cookie-session')({
  secret: 's3cr3t#s3cr3t',
  resave: true,
  saveUninitialized: true,
}))

require('./auth')(app)

var dirs = [
  path.join(__dirname, 'controllers', 'api'),
  path.join(__dirname, 'controllers', 'admin')
]
dirs.forEach(function(dir) {
  fs.readdirSync(dir).forEach(function(file) {
    if (file.endsWith('.js')) {
      var m = require(path.join(dir, file))
      if (m.configure) {
        m.configure(app)
      }
    }
  })
})

app.get('/admin', function(req, res, next) {
  res.render('admin/index')
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
  var port = process.env.PORT || 3000
  http.createServer(app).listen(port)
  console.log('Started server at port %d', port)
}
