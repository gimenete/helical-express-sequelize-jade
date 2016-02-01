var passport = require('passport')
var models = require('../../models')

exports.configure = function(app) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, { id: user.id })
  })

  passport.deserializeUser(function(user, done) {
    models.User.findById(user.id)
      .then((user) => done(null, user))
      .catch(done)
  })

  app.get('/logout', function(req, res, next) {
    req.logout()
    res.redirect('/')
  })

}
