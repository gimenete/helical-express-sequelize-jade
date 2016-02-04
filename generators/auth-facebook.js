var passport = require('passport')
var FacebookStrategy = require('passport-facebook')
var models = require('../../models')

exports.configure = function(app) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    function(token, tokenSecret, profile, done) {
      models.User.find({ where: { facebookId: profile.id } })
      .then((user) => (
        user || models.User.create({
          facebookId: profile.id,
          name: profile.displayName,
        })
      ))
      .then((user) => done(null, user))
      .catch(done)
    }
  ))

  app.get('/auth/facebook', passport.authenticate('facebook'))

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      return res.redirect('/')
    })

}
