const mongoose = require('mongoose')
const mongodb = require('../config/mongodb')
const isDevEnv = process.env.NODE_ENV === 'development'

module.exports = () => {
	let connectURL = `mongodb+srv://${mongodb.prod.user}:${mongodb.prod.password}@${mongodb.prod.host}/${mongodb.prod.database}?retryWrites=true`

	if (isDevEnv) {
		connectURL = `mongodb://${mongodb.dev.host}:27017/${mongodb.dev.database}?retryWrites=true`
	}

	mongoose.connection.on('connected', () => {
		console.log('Connection to MongoDB established.')
	})

	mongoose.connection.on('error', () => {
		console.error('MongoDB connection error.')
	})

	return mongoose.connect(connectURL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
}
