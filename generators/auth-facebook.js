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
      .then((user) => {
        if (user) return done(null, user)
        user = {
          facebookId: profile.id,
          name: profile.displayName,
        }
        console.log('profile', profile)
        return models.User.create(user)
          .then((user) => {
            done(null, { id: user.id })
          })
      })
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
