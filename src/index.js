const express = require('express')
const fileUpload = require('express-fileupload')
const jwt = require('express-jwt')
const https = require('https')
const cors = require('cors')
const fs = require('fs')
const logger = require('morgan')
const bodyParser = require('body-parser')
const APP_CONFIG = require('./constants')
const mongooseInit = require('./config/mongoose')
const cronInit = require('./config/cron')
const staticRoutes = require('./routes/static')
const channelRoutes = require('./routes/channel')
const rewardRoutes = require('./routes/reward')
const userRoutes = require('./routes/user')
const claimRoutes = require('./routes/claim')
const battleRoutes = require('./routes/battle')
const app = express()

// Connect to MongoDB via Mongoose
mongooseInit().then(() => {
	// Set cron to add every miniute points
	cronInit()

	// Set CORS for browsers
	app.use(cors({
		origin: process.env.NODE_ENV === 'development' ? '*' : `https://${APP_CONFIG.clientId}.ext-twitch.tv`,
		allowedHeaders: ['Content-Type, Authorization']
	}))

	// Directly serve the static content in the public folder
	app.use(express.static('public'))

	app.use(staticRoutes)

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
			{ url: '/claim', methods: ['GET'] }
		]
	}))

	// Set file limits
	app.use(fileUpload({
		limits: { fileSize: 2 * 1024 * 1024 }
	}))

	// Set our REST end points
	app.use(channelRoutes)
	app.use(rewardRoutes)
	app.use(userRoutes)
	app.use(claimRoutes)
	app.use(battleRoutes)

	// Send 500 status code with simple message to the client when unhandled errors occur
	app.use((err, req, res, next) => {
		if (err.name === 'UnauthorizedError') {
			res.status(401).send('Invalid JWT token.')
			return
		}

		console.log(err)

		res.status(500).send('Iternal server error!')
	})

	// Start the server
	if (process.env.NODE_ENV === 'development') {
		https.createServer({
			key: fs.readFileSync('./ssl/server.key'),
			cert: fs.readFileSync('./ssl/server.cert')
		}, app).listen(443, () => console.log(`Server has started on 443.`))
	} else {
		app.listen(3000, () => console.log(`Server has started on 3000.`))
	}
})
