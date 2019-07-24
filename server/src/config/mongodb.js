module.exports = {
	dev: {
		host: process.env.DOCKER === 'true' ? 'mongo' : 'localhost',
		database: 'alter'
	},
	prod: {
		host: 'cluster0-9dfxt.gcp.mongodb.net',
		database: 'alter',
		user: 'alter',
		password: '3CJrUihr1m0gsTEW'
	}
}
