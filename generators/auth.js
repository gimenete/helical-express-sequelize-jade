var passport = require('passport')
var TwitterStrategy = require('passport-twitter')
var request = require('request')
var errors = require('node-errors')

module.exports = function(app) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    var options = {
      url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
      oauth: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        token: user.token,
        token_secret: user.tokenSecret,
      },
      json: true,
    }
    request(options, function(err, res, body) {
      if (err) return done(err)
      var usr = {
        id: body.id,
        screen_name: body.screen_name,
      }
      done(null, usr)
    })
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    function(token, tokenSecret, profile, done) {
      var id = profile.id
      var user = {
        token: token,
        tokenSecret: tokenSecret,
      }
      done(null, user)
    }
  ))

  var twitter = passport.authenticate('twitter')
  app.get('/auth/twitter', function(req, res, next) {
    twitter(req, res, next)
  })

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
      return res.redirect('/')
    })

  app.get('/logout', function(req, res, next) {
    req.logout()
    res.redirect('/')
  })

}
