const express = require('express')
const jwt = require('express-jwt')
const https = require('https')
const cors = require('cors')
const fs = require('fs')
const logger = require('morgan')
const bodyParser = require('body-parser')
const APP_CONFIG = require('./constants')
const mongooseInit = require('./config/mongoose')
const cronInit = require('./config/cron')
const channelRoute = require('./routes/channel')
const rewardRoute = require('./routes/reward')
const userRoute = require('./routes/user')
const claimRoute = require('./routes/claim')
const app = express()

// Connect to MongoDB via Mongoose
mongooseInit().then(() => {
	// Set cron to add every miniute points
	cronInit('* * * * *')

	// Set CORS for browsers
	app.use(cors({
		origin: '*',
		allowedHeaders: ['Content-Type, Authorization']
	}))

	// Parse JSON from requests automatically
	app.use(bodyParser.json())

	// Write errors in a log file via Morgan
	app.use(logger('common', {
		skip: (req, res) => res.statusCode < 400,
		stream: fs.createWriteStream('./error.log', { flags: 'a' })
	}))

	// Log requests in the console
	app.use((req, res, next) => {
		console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
		next()
	})

	// Check JWT
	app.use(jwt({ secret: Buffer.from(APP_CONFIG.twitchSecret, 'base64') }).unless({
		path: [
			/\./, // TODO: FIX THAT <<
			{ url: '/channel', methods: ['GET']  },
			{ url: '/claim', methods: ['GET']  }
		]
	 }))

	// Set our REST end points
	app.use(channelRoute)
	app.use(rewardRoute)
	app.use(userRoute)
	app.use(claimRoute)

	// Directly serve the static content in the public folder
	app.use(express.static('public'))

	// Send 500 status code with simple message to the client when unhandled errors occur
	app.use((err, req, res, next) => {
		if (err.name === 'UnauthorizedError') {
			res.status(401).send('Invalid JWT token.')
			return
		}

		res.status(500).send('Iternal server error!')
	})

	// // Start the server
	// https.createServer({
	// 	key: fs.readFileSync('./ssl/server.key'),
	// 	cert: fs.readFileSync('./ssl/server.cert'),
	// }, app).listen(443, () => console.log(`Server has started on 443.`))

	app.listen(80)
})
