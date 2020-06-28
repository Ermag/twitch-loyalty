module.exports = {
	dev: {
		host: process.env.DOCKER === 'true' ? 'mongo' : 'localhost',
		database: 'alter'
	},
	prod: {
		host: '',
		database: '',
		user: '',
		password: ''
	}
}
