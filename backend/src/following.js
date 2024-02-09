const User = require('./model/User')

async function getFollowing(req, res) {
  try {
    const username = req.params.user
    const user = await User.findOne({ username }).exec()
    res.send({ username, following: user.following })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function putFollowing(req, res) {
  try {
    const newFollowing = req.params.user

    const user = await User.findOne({
      username: req.user.username,
    }).exec()

    if (newFollowing === req.user.username) {
      return res.send({
        username: req.user.username,
        following: user.following,
      })
    }

    if (user.following.includes(newFollowing)) {
      return res.send({ username: user.username, following: user.following })
    }
    // check if newFollowing exists
    const newUser = await User.findOne({ username: newFollowing }).exec()
    if (!newUser) {
      return res
        .status(404)
        .send({ username: newFollowing, result: 'not found' })
    }

    user.following.push(newFollowing)
    await user.save()
    req.login(user, () => {
      res.send({ username: user.username, following: user.following })
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

async function deleteFollowing(req, res) {
  try {
    const delFollowing = req.params.user
    const user = await User.findOne({
      username: req.user.username,
    }).exec()

    if (!user.following.includes(delFollowing)) {
      return res.send({ username: user.username, following: user.following })
    }

    user.following = user.following.filter((f) => f !== delFollowing)
    await user.save()
    req.login(user, () => {
      res.send({ username: user.username, following: user.following })
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

module.exports = (app) => {
  app.get('/api/following/:user', getFollowing)
  app.put('/api/following/:user', putFollowing)
  app.delete('/api/following/:user', deleteFollowing)
}
