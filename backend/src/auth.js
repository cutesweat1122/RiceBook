const md5 = require('md5')
const User = require('./model/User')
const Profile = require('./model/Profile')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20')

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user)
  })
})

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user)
  })
})

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      // find user by google id
      try {
        const user = await User.findOne({ googleId: profile.id }).exec()
        console.log({ profile })
        if (!user) {
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
          })
          await newUser.save()
          const newProfile = new Profile({
            userId: newUser._id,
            username: profile.displayName,
            email: profile._json.email,
            avatar: profile._json.picture,
          })
          await newProfile.save()
          return cb(null, newUser)
        } else {
          return cb(null, user)
        }
      } catch (error) {
        console.log(error)
        return cb({ status: 500, message: 'internal error' })
      }
    }
  )
)

passport.use(
  'local',
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await User.findOne({ username: username }).exec()
      if (!user) {
        return cb({ status: 404, message: 'user not found' })
      }
      const hash = md5(user.salt + password)
      if (hash === user.password) {
        return cb(null, user)
      } else {
        return cb({ status: 401, message: 'incorrect password' })
      }
    } catch (error) {
      console.log(error)
      return cb({ status: 500, message: 'internal error' })
    }
  })
)

function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401)
  } else {
    return next()
  }
}

async function login(req, res) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      console.log({ err })
      return res
        .status(err.status)
        .send({ username: req.body.username, result: err.message })
    }

    req.login(user, () => {
      res.send({ username: req.body.username, result: 'success' })
    })
  })(req, res)
}

async function googleAuthCB(req, res) {
  passport.authenticate('google', async function (err, user) {
    const redirect = req.session.redirect || '/'
    delete req.session.redirect
    // if req.user already exist, merge with google user
    // else, login with google user
    if (req.user) {
      const oriUser = await User.findOne({ _id: req.user._id }).exec()
      oriUser.googleId = user.googleId
      oriUser.following = [...req.user.following, ...user.following]
      await oriUser.save()
      // delete google user and profile
      await User.deleteOne({ _id: user._id }).exec()
      await Profile.deleteOne({ userId: user._id }).exec()
      return req.login(oriUser, () => {
        res.redirect(redirect)
      })
    } else {
      return req.login(user, () => {
        res.redirect(redirect)
      })
    }
  })(req, res)
}

async function googleAuth(req, res) {
  req.session.redirect = req.query.redirect
  passport.authenticate('google')(req, res)
}

async function logout(req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
}

async function register(req, res) {
  try {
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const dob = req.body.dob
    const phone = req.body.phone
    const zipcode = req.body.zipcode
    if (!username || !password || !email || !dob || !phone || !zipcode) {
      return res.sendStatus(400)
    }

    const salt = username + new Date().getTime()
    const hash = md5(salt + password) // use md5 to create a hash

    const newUser = new User({
      username,
      salt,
      password: hash,
    })
    await newUser.save()

    const newProfile = new Profile({
      userId: newUser._id,
      username,
      email,
      dob,
      phone,
      zipcode,
    })
    await newProfile.save()
    req.login(newUser, () => {
      res.send({ username: req.body.username, result: 'success' })
    })
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      return res.status(400).send({
        username: req.body.username,
        result: 'This username has already been registered',
      })
    }
    res.sendStatus(500)
  }
}

const putPassword = async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      return res.sendStatus(400)
    }

    const user = await User.findOne({ username: username }).exec()

    if (!user) {
      return res
        .status(404)
        .send({ username: username, result: 'user not found' })
    }

    // Create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5(user.salt + password)

    if (hash === user.password) {
      return res
        .status(401)
        .send({ username: username, result: 'same password' })
    } else {
      user.password = hash
      await user.save()
      return res.send({ username: username, result: 'success' })
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = (app) => {
  app.post('/api/login', login)
  app.put('/api/logout', logout)
  app.post('/api/register', register)
  app.put('/api/password', putPassword)
  app.get('/api/auth/google/callback', googleAuthCB)
  app.get('/api/auth/google', googleAuth)
  app.use('/api', isLoggedIn)
  app.get('/api/google', (req, res) => {
    res.send({ username: req.user.username, googleId: req.user.googleId })
  })
  app.delete('/api/google', async (req, res) => {
    const user = await User.findOne({ _id: req.user._id }).exec()
    user.googleId = undefined
    await user.save()
    req.login(user, () => {
      res.send({ username: req.user.username, googleId: undefined })
    })
  })
}
