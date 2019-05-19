const express = require('express')
const mongoose = require('mongoose')
const ChannelModel = require('../models/channel')
const ProfileModel = require('../models/profile')
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

	let profileData = {
		userId: req.body.userId,
		displayName: req.body.displayName,
		username: req.body.username,
		avatar: req.body.avatar,
		updatedAt: new Date(req.body.updatedAt)
	}

	ProfileModel.findOne({
		userId: req.body.userId
	}).then(doc => {
		if (!doc) {
			let newProfile = new ProfileModel(profileData)

			newProfile.save().then(doc => {
				if (!doc || doc.length === 0) {
					return res.status(500).send(doc)
				}

				findOrCreateUser(channel, doc, req, res)
			}).catch(err => {
				res.status(500).json(err)
			})
		} else {
			// Update if time differs from our DB and Twitch
			if (doc.updatedAt.getTime() !== profileData.updatedAt.getTime()) {
				ProfileModel.findOneAndUpdate({
					_id: doc._id
				}, profileData, {
					new: true
				}).then(doc => {
					if (!doc || doc.length === 0) {
						return res.status(500).send(doc)
					}

					findOrCreateUser(channel, doc, req, res)
				}).catch(err => {
					res.status(500).json(err)
				})
			} else {
				findOrCreateUser(channel, doc, req, res)
			}
		}
	})
}

const findOrCreateUser = (channel, profile, req, res) => {
	let userData = {
		channel: channel._id,
		profile: profile._id,
		isFollowing: req.body.isFollowing,
		isSubscriber: req.body.isSubscriber,
		updatedAt: new Date(req.body.updatedAt)
	}

	// Check if the channel exists
	UserModel.findOne({
		channel: channel._id,
		profile: profile._id
	}).populate('channel').populate('profile').then(doc => {
		// Create the user if its not there
		if (!doc) {
			let newUser = new UserModel(userData)

			newUser.save().then(doc => {
				if (!doc || doc.length === 0) {
					return res.status(500).send(doc)
				}

				doc.channel = channel
				doc.profile = profile

				res.status(201).send(doc)
			}).catch(err => {
				res.status(500).json(err)
			})
		} else {
			// Update if follow or subscriber status has changed
			if (
				doc.isFollowing !== userData.isFollowing ||
				doc.isSubscriber !== userData.isSubscriber
			) {
				UserModel.findOneAndUpdate({
					_id: doc._id
				}, userData, {
					new: true
				}).populate('channel').populate('profile').then(doc => {
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

const findAndSortUsers = (users, req, res) => {
	if (!users && users.length) {
		return res.status(404).send('No users found.')
	} else {
		let pos = '100 >'
		let newUsers = []

		for (let i = 0; i < users.length; i++) {
			if (i > 99) {
				break
			}

			if (String(users[i]._id) === req.query.uid) {
				pos = i + 1
			}

			newUsers.push(users[i])
		}

		res.json({
			pos,
			users: newUsers
		})
	}
}

// GET all
router.get(`/${name}s`, (req, res) => {
	if (!req.query.cid) {
		return res.status(400).send('Missing cid.')
	}

	let sortReq = parseInt(req.query.sort)

	if (sortReq === 1) {
		UserModel.aggregate([
			{ '$match': { channel: mongoose.Types.ObjectId(req.query.cid) } },
			{ '$lookup': {
				'from': 'profiles',
				'localField': 'profile',
				'foreignField': '_id',
				'as': 'profile'
			} },
			{ '$unwind': '$profile' },
			{ '$group': {
				'_id': '$_id',
				'profile': { '$first': '$profile' }
			} },
			{ '$sort': { 'profile.experience': -1 } },
			{ '$limit': 100 }
		]).then(docs => {
			console.log(docs)
			findAndSortUsers(docs, req, res)
		}).catch(err => {
			res.status(500).json(err)
		})
	} else {
		let sort = '-points'

		if (sortReq === 2) {
			sort = '-claimedCount'
		} else if (sortReq === 3) {
			sort = '-battlesWon'
		}

		UserModel.find({
			channel: req.query.cid
		}).sort(sort).limit(1000).populate('profile').then(docs => {
			findAndSortUsers(docs, req, res)
		}).catch(err => {
			res.status(500).json(err)
		})
	}
})

// GET
router.get(`/${name}`, (req, res) => {
	if (!req.query.id) {
		return res.status(400).send('Missing user id.')
	}

	UserModel.findById(req.query.id).populate('channel').populate('profile').then(doc => {
		if (!doc) {
			return res.status(404).send('User not found.')
		} else {
			res.json(doc)
		}
	}).catch(err => {
		res.status(500).json(err)
	})
})

// GET Random
router.get(`/${name}Rand`, (req, res) => {
	if (!req.query.cid) {
		return res.status(400).send('Missing channel id.')
	}

	UserModel.count({
		channel: req.query.cid
	}).exec(function (err, count) {
		if (err) {
			return res.status(404).send('No user found.')
		}

		// Get a random entry
		let random = Math.floor(Math.random() * count)

		// Again query all users but only fetch one offset by our random #
		UserModel.findOne({
			channel: req.query.cid
		}).skip(random).populate('profile').exec(function (err, result) {
			if (err) {
				return res.status(404).send('User not found.')
			} else {
				res.json(result)
			}
		})
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
