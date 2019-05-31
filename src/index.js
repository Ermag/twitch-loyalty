const express = require('express')
const fileUpload = require('express-fileupload')
const jwt = require('express-jwt')
const compression = require('compression')
const https = require('https')
const cors = require('cors')
const fs = require('fs')
const logger = require('morgan')
const bodyParser = require('body-parser')
const APP_CONFIG = require('./constants')
const mongooseConnect = require('./services/mongoose')
const cronInit = require('./services/cron')
const staticRoutes = require('./routes/static')
const listRoutes = require('./routes')
const app = express()
const isDevEnv = process.env.NODE_ENV === 'development'

console.log(Array.from(Array(20), () => '-').join(''))
console.log(`Running in ${isDevEnv ? 'DEVELOPMENT' : 'PRODUCTION'} mode.`)

// Connect to MongoDB via Mongoose
mongooseConnect().then(() => {
	// Set crons for points and live channels
	cronInit()

	// Use compression
	app.use(compression())

	// Set CORS for browsers
	app.use(cors({
		origin: isDevEnv ? '*' : `https://${APP_CONFIG.clientId}.ext-twitch.tv`,
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
			{ url: '/claim', methods: ['GET'] },
			{ url: '/channelById', methods: ['GET'] }
		]
	}))

	// Set file limits
	app.use(fileUpload({
		limits: { fileSize: 2 * 1024 * 1024 }
	}))

	// Set our REST end points
	listRoutes.forEach(route => {
		app.use(route)
	})

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
	if (isDevEnv) {
		https.createServer({
			key: fs.readFileSync('./ssl/local.key'),
			cert: fs.readFileSync('./ssl/local.pem')
		}, app).listen(443, 'localhost.rig.twitch.tv', () => console.log(`Server running at https://localhost.rig.twitch.tv`))
	} else {
		app.listen(3000, () => console.log(`Server has started on 3000.`))
	}
})
