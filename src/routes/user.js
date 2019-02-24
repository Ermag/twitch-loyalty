const express = require('express')
const ChannelModel = require('../models/channel')
const UserModel = require('../models/user')
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
		channel: channel._id,
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
			// Update if time differs from our DB and Twitch or follow is changed
			if (
				doc.updatedAt.getTime() !== userData.updatedAt.getTime() ||
				doc.isFollowing !== userData.isFollowing
			) {
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

// GET all
router.get(`/${name}s`, (req, res) => {
	if (!req.query.cid) {
		return res.status(400).send('Missing user cid.')
	}

	let sort = '-points'

	if (req.query.sort == 1) {
		sort = '-experience'
	} else if (req.query.sort == 2) {
		sort = '-claimedCount'
	}

    UserModel.find({
        channel: req.query.cid
    }).sort(sort).limit(1000).then(docs => {
		if (!docs && docs.length) {
			return res.status(404).send('No users found.')
		} else {
			let pos = 0;
			let users = []

			for (let i = 0; i < docs.length; i++) {
				if (i > 99) {
					break;
				}

				if (docs[i]._id == req.query.uid) {
					pos = i + 1;
				}

				users.push(docs[i])
			}

			res.json({
				pos,
				users
			})
		}
    }).catch(err => {
        res.status(500).json(err)
    })
})

// GET
router.get(`/${name}`, (req, res) => {
	if (!req.query.id) {
		return res.status(400).send('Missing user id.')
	}

    UserModel.findOne({
        _id: req.query.id
    }).populate('channel').then(doc => {
		if (!doc) {
			return res.status(404).send('User not found.')
		} else {
			res.json(doc)
		}
    }).catch(err => {
        res.status(500).json(err)
    })
})


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
