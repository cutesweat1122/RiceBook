const auth = require('./src/auth')
const profile = require('./src/profile')
const article = require('./src/articles')
const following = require('./src/following')
require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')
const upCloud = require('./src/uploadCloudinary')
const passport = require('passport')
const path = require('path')

const app = express()
app.enable('trust proxy')
app.use(
  cors({
    origin: '*',
  })
)
app.use(bodyParser.json())
app.use(
  session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true,
    httpOnly: true,
  })
)
app.use(express.static(path.join(__dirname, './public')))
app.use(passport.initialize())
app.use(passport.authenticate('session'))
app.use(cookieParser())
upCloud.setup(app)
auth(app)
article(app)
profile(app)
following(app)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  const addr = server.address()
  console.log(`Server listening at http://${addr.address}:${addr.port}`)
})
