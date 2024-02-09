const mongoose = require('mongoose')
const connectionString = process.env.DB_URL

mongoose.connect(connectionString, {
  dbName: process.env.DB_NAME || 'dev',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('error', (error) => console.error(error))
mongoose.connection.once('open', () => console.log('Connected to MongoDB!'))
