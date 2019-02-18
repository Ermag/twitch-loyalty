const express = require('express')
const https = require('https')
const cors = require('cors')
const fs = require('fs')
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongooseInit = require('./config/mongoose')
const channelRoute = require('./routes/channel')
const app = express()

mongooseInit();

app.use(cors({
	origin: '*',
	allowedHeaders: ['Content-Type, Authorization']
}))

app.use(bodyParser.json())

app.use(logger('common', {
	skip: (req, res) => res.statusCode < 400,
    stream: fs.createWriteStream('./error.log', { flags: 'a' })
}))

app.use((req, res, next) => {
	console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
	next()
})

app.use(channelRoute)

app.use(express.static('public'))

app.use((err, req, res, next) => {
	res.status(500).send('Iternal server error!')
})

https.createServer({
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.cert'),
}, app).listen(443, () => console.log(`Server has started on 443.`))
