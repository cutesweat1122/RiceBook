const Profile = require('./model/Profile')

const getHeadline = (req, res) => {
  res.send({ username: req.profile.username, headline: req.profile.headline })
}

const putHeadline = async (req, res) => {
  try {
    const user = req.user
    user.headline = req.body.headline
    await Profile.updateOne(
      { username: user.username },
      { headline: user.headline }
    ).exec()
    res.send({ username: user.username, headline: req.body.headline })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const getEmail = (req, res) => {
  res.send({ username: req.profile.username, email: req.profile.email })
}

const putEmail = async (req, res) => {
  try {
    const user = req.user
    await Profile.updateOne(
      { username: user.username },
      { email: req.body.email }
    ).exec()
    res.send({ username: user.username, email: req.body.email })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const getZipcode = (req, res) => {
  res.send({ username: req.profile.username, zipcode: req.profile.zipcode })
}

const putZipcode = async (req, res) => {
  try {
    const user = req.user
    await Profile.updateOne(
      { username: user.username },
      { zipcode: req.body.zipcode }
    ).exec()
    res.send({ username: user.username, zipcode: req.body.zipcode })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const getPhone = (req, res) => {
  res.send({ username: req.profile.username, phone: req.profile.phone })
}

const putPhone = async (req, res) => {
  try {
    const user = req.user
    await Profile.updateOne(
      { username: user.username },
      { phone: req.body.phone }
    ).exec()
    res.send({ username: user.username, phone: req.body.phone })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const getAvatar = (req, res) => {
  res.send({ username: req.profile.username, avatar: req.profile.avatar })
}

const putAvatar = async (req, res) => {
  try {
    const user = req.user
    await Profile.updateOne(
      { username: user.username },
      { avatar: req.body.avatar }
    ).exec()
    res.send({ username: user.username, avatar: req.body.avatar })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

const getDob = (req, res) => {
  res.send({ username: req.profile.username, dob: req.profile.dob })
}

const getProfile = async (req, res, next) => {
  try {
    const username = req.params.user
    if (username) {
      const profile = await Profile.findOne({ username: username }).exec()
      if (!profile) {
        return res
          .status(404)
          .send({ username: username, result: 'profile not found' })
      }
      req.profile = profile
      return next()
    }

    const user = req.user
    const profile = await Profile.findOne({ username: user.username }).exec()
    req.profile = profile
    return next()
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = (app) => {
  app.put('/api/headline', putHeadline)
  app.get('/api/headline/:user?', getProfile, getHeadline)
  app.put('/api/email', putEmail)
  app.get('/api/email/:user?', getProfile, getEmail)
  app.put('/api/zipcode', putZipcode)
  app.get('/api/zipcode/:user?', getProfile, getZipcode)
  app.put('/api/phone', putPhone)
  app.get('/api/phone/:user?', getProfile, getPhone)
  app.put('/api/avatar', putAvatar)
  app.get('/api/avatar/:user?', getProfile, getAvatar)
  app.get('/api/dob/:user?', getProfile, getDob)
}
