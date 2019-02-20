const express = require('express')
const REWARDS = require('../config/rewards')
const ChannelModel = require('../models/channel')
const UserModel = require('../models/user')
const RewardModel = require('../models/reward')
const router = express.Router()
const name = 'user'
const findOrCreate = (channel, req, res) => {
	if (
		!req.body.userId || !req.body.displayName || !req.body.username ||
		!req.body.avatar || !req.body.updatedAt || req.body.isFollowing === undefined
	) {
		return res.status(400).send('Missing required parameters.')
	}

	let userData = {
		channel: channel._id,
		userId: req.body.userId,
		displayName: req.body.displayName,
		username: req.body.username,
		avatar: req.body.avatar,
		isFollowing: req.body.isFollowing,
		updatedAt: new Date(req.body.updatedAt)
	}

	// Check if the channel exists
    UserModel.findOne({
        userId: req.body.userId
    }).populate('channel').then(doc => {
		// Create the user if its not there
		if (!doc) {
			let newUser = new UserModel(userData)

			newUser.save().then(doc => {
				if (!doc || doc.length === 0) {
					return res.status(500).send(doc)
				}

				doc.channel = channel

				res.status(201).send(doc)
			}).catch(err => {
				res.status(500).json(err)
			})
		} else {
			// Update if time differs from our DB and Twitch
			if (doc.updatedAt.getTime() !== userData.updatedAt.getTime()) {
				UserModel.findOneAndUpdate({
					_id: doc._id
				}, userData, {
					new: true
				}).then(doc => {
					if (!doc || doc.length === 0) {
						return res.status(500).send(doc)
					}

					res.json(doc)
				}).catch(err => {
					res.status(500).json(err)
				})
			} else {
				res.json(doc)
			}
		}
    }).catch(err => {
        res.status(500).json(err)
    })
}

// GET TODO: Return all users with limit, offest and sorting

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

    if (!req.body.tid || req.body.tid.length < 6) {
		return res.status(400).send('Missing valid tid.')
	}

	// Check if the channel exists
    ChannelModel.findOne({
        tid: req.body.tid
    }).then(doc => {
		// Create the channel if we can't find it with some example rewards
		if (!doc) {
			ChannelModel.cAddNew(req.body.tid).then(doc => {
				findOrCreate(doc, req, res)
			}).catch(err => {
				res.status(500).json(err)
			})
		} else {
			findOrCreate(doc, req, res)
		}
    }).catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router
