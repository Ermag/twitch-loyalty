const express = require('express')
const ChannelModel = require('../models/channel')
const router = express.Router()
const name = 'channel'

// GET
router.get(`/${name}`, (req, res) => {
    if (!req.query.tid || req.query.tid.length < 6) {
		return res.status(400).send('Missing valid tid.')
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

module.exports = router
