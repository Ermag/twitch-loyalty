const mongoose = require('mongoose')
const host = 'cluster0-9dfxt.gcp.mongodb.net'
const database = 'alter'
const user = 'alter'
const password = '3CJrUihr1m0gsTEW'
const init = () => {
	mongoose.connection.on('connected', () => {
		console.log('Connection to MongoDB established.')
	})

	mongoose.connection.on('error', () => {
		console.error('MongoDB connection error.')
	})

	mongoose.connect(`mongodb+srv://${user}:${password}@${host}/test?retryWrites=true`, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		dbName: database
	})
}

module.exports = init
