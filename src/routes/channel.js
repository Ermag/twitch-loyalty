const express = require('express')
const jwtDecode = require('jwt-decode')
const ChannelModel = require('../models/channel')
const router = express.Router()
const name = 'channel'

// GET
router.get(`/${name}`, (req, res) => {
	if (!req.query.tid) {
		return res.status(400).send('Missing twitch id.')
	}

	ChannelModel.findOne({
		tid: req.query.tid
	}).then(doc => {
		// Create the channel if we can't find it with some example rewards
		if (!doc) {
			ChannelModel.cAddNew(req.query.tid).then(doc => {
				res.status(201).send(doc)
			}).catch(err => {
				res.status(500).json(err)
			})
		} else {
			res.json(doc)
		}
	}).catch(err => {
		res.status(500).json(err)
	})
})

// GET
router.get(`/${name}ById`, (req, res) => {
	if (!req.query.cid) {
		return res.status(400).send('Missing channel id.')
	}

	ChannelModel.findOne({
		_id: req.query.cid
	}).then(doc => {
		if (!doc) {
			res.status(500).json('No channel with such id.')
		} else {
			res.json(doc)
		}
	}).catch(err => {
		res.status(500).json(err)
	})
})

// UPDATE
function updateChannel (req, res, query = {}) {
	ChannelModel.findOneAndUpdate({
		_id: req.query.cid
	}, {
		...query,
		updatedAt: new Date()
	}, {
		new: true
	}).then(doc => {
		if (!doc || doc.length === 0) {
			return res.status(500).send(doc)
		}

		res.json(doc)
	}).catch(err => {
		res.status(500).json(err)
	})
}

router.put(`/${name}`, (req, res) => {
	if (!req.query.cid) {
		return res.status(400).send('Missing channel id.')
	}

	let query = {}

	// Check for valid points name
	if (req.body.name) {
		if (req.body.name.length <= 0 || req.body.name.length > 20) {
			return res.status(400).send('Request contains invalid name.')
		}

		query.pointsName = req.body.name
	}

	// Check for valid volume
	if (req.body.volume) {
		if (isNaN(req.body.volume) || req.body.volume < 0 || req.body.volume > 1) {
			return res.status(400).send('Request contains invalid volume.')
		}

		query.alertsVolume = req.body.volume
	}

	let jwt = jwtDecode(req.headers.authorization)

	ChannelModel.findOne({
		_id: req.query.cid
	}).then(doc => {
		if (!doc || doc.length === 0) {
			return res.status(500).send(doc)
		}

		if (doc.tid !== jwt.channel_id) {
			return res.status(401).send('Nice try.')
		}

		if (req.files && req.files.image) {
			let validFileTypes = ['jpg', 'jpeg', 'gif', 'png', 'bmp']
			let imageFile = req.files.image
			let imageExt = imageFile.name.split('.').pop()
			let imageName = `c-${req.query.cid}.${imageExt}`

			if (validFileTypes.indexOf(imageExt) === -1) {
				return res.status(400).send('Request contains invalid image.')
			}

			query.pointsImg = imageName

			imageFile.mv(`./public/${imageName}`, err => {
				if (err) {
					return res.status(500).send(err)
				} else {
					updateChannel(req, res, query)
				}
			})
		} else {
			updateChannel(req, res, query)
		}
	})
})

module.exports = router
