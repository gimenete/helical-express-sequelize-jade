var passport = require('passport')
var TwitterStrategy = require('passport-twitter')
var models = require('../../models')

exports.configure = function(app) {
  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    function(token, tokenSecret, profile, done) {
      models.User.find({ where: { twitterId: profile.id } })
      .then((user) => (
        user || models.User.create({
          twitterId: profile.id,
          twitterUsername: profile.username,
          name: profile.displayName,
        })
      ))
      .then((user) => done(null, user))
      .catch(done)
    }
  ))

  app.get('/auth/twitter', passport.authenticate('twitter'))

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
      return res.redirect('/')
    })

}
