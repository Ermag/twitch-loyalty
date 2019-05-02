const express = require('express')
const ClaimModel = require('../models/claim')
const RewardModel = require('../models/reward')
const UserModel = require('../models/user')
const router = express.Router()
const name = 'claim'

// GET
router.get(`/${name}`, (req, res) => {
	if (!req.query.cid && !req.query.uid && !req.query.rid) {
		return res.status(400).send('Missing valid id.')
	}

	let params = { channel: req.query.cid }

	if (req.query.uid) {
		params['user'] = req.query.uid
	}

	if (req.query.rid) {
		params['reward'] = req.query.rid
	}

	// Check for time
	if (req.query.afterDate) {
		params['createdAt'] = {
			'$gte': new Date(parseInt(req.query.afterDate))
		}
	}

	ClaimModel.find(params)
	.sort('-createdAt')
	.populate('channel')
	.populate({ path: 'user', populate: { path: 'profile' } })
	.populate('reward').then(docs => {
		// Create the channel if we can't find it with some example rewards
		if (!docs && !docs.length) {
			res.status(404).json('No rewards found.')
			return
		}

		let claims = []

		docs.forEach(doc => {
			if (!doc.reward.ref || doc.reward.ref === 'test' || req.query.rid) {
				claims.push(doc)
			}
		})

		res.json(claims)
	}).catch(err => {
		res.status(500).json(err)
	})
})

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	// Check for valid params
	if (!req.body.reward || !req.body.user || !req.body.channel) {
		return res.status(400).send('Request contains invalid data.')
	}

	// Check for the message length
	if (req.body.msg && req.body.msg.length > 100) {
		return res.status(400).send('Message length exceeds the limit (100).')
	}

	// Get the reward and the user
	Promise.all([
		RewardModel.findOne({
			_id: req.body.reward,
			status: 1
		}),
		UserModel.findOne({
			_id: req.body.user
		})
	]).then(([reward, user]) => {
		if (!reward && !user) {
			res.status(404).json('Invalid data.')
			return
		}

		if (user.currentPoints < reward.points) {
			res.status(409).json('Not enough points to claim the reward.')
			return
		}

		if (reward.claimOnce) {
			ClaimModel.findOne({
				reward: reward._id,
				channel: req.body.channel,
				user: req.body.user
			}).then(doc => {
				if (!doc) {
					ClaimModel.addClaim(req.body.channel, req.body.msg, reward, user).then(doc => {
						res.status(201).send(doc)
					}).catch(err => {
						res.status(500).json(err)
					})
				} else {
					res.status(401).send('Already claimed.')
				}
			}).catch(err => {
				res.status(500).json(err)
			})
		} else {
			ClaimModel.addClaim(req.body.channel, req.body.msg, reward, user).then(doc => {
				res.status(201).send(doc)
			}).catch(err => {
				res.status(500).json(err)
			})
		}
	}).catch(err => {
		res.status(404).json(err)
	})
})

// POST
router.post(`/${name}Test`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	// Check for valid params
	if (!req.body.reward || !req.body.channel) {
		return res.status(400).send('Request contains invalid data.')
	}

	// Get the reward and the user
	RewardModel.findOne({
		_id: req.body.reward,
		status: 1
	}).then(reward => {
		if (!reward) {
			res.status(404).json('Invalid data.')
			return
		}

		// Check for buffer of 10s between claims
		let date = new Date()
		date.setSeconds(date.getSeconds() - 20)

		ClaimModel.findOne({
			reward: reward._id,
			createdAt: {
				'$gte': date
			}
		}).then(doc => {
			if (!doc) {
				ClaimModel.addClaim(req.body.channel, 'Hello wonderful streamer :) This is a test message.', reward, {}).then(doc => {
					res.status(201).send(doc)
				}).catch(err => {
					res.status(500).json(err)
				})
			} else {
				res.status(401).send('Already claimed.')
			}
		}).catch(err => {
			res.status(500).json(err)
		})
	}).catch(err => {
		res.status(404).json(err)
	})
})

module.exports = router
