var passport = require('passport')
var TwitterStrategy = require('passport-twitter')
var request = require('request')
var errors = require('node-errors')

var consumerKey = 'YOUR_TWITTER_CONSUMER_KEY'
var consumerSecret = 'YOUR_TWITTER_CONSUMER_SECRET'

module.exports = function(app) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    var options = {
      url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
      oauth: {
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
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

  var callbackURL = process.env.NODE_ENV === 'production' ? 'http://{{ root.projectName }}.herokuapp.com/auth/twitter/callback' : 'http://localhost:3000/auth/twitter/callback'
  passport.use(new TwitterStrategy({
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      callbackURL: callbackURL,
    },
    function(token, tokenSecret, profile, done) {
      var id = profile.id
      var user = {
        token: token,
        tokenSecret: tokenSecret,
      }
      done(null, user);
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
