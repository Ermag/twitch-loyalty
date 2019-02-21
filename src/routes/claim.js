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
		params[user] = req.query.uid
	}

	if (req.query.rid) {
		params[reward] = req.query.rid
	}

    ClaimModel.find(params).populate('channel').populate('user').populate('reward').then(docs => {
		// Create the channel if we can't find it with some example rewards
		if (!docs && !docs.length) {
			res.status(404).json('No rewards found.')
			return
		}

		let claims = []

		docs.forEach(doc => {
			if (!doc.reward.ref.length) {
				claims.push(doc)
			}
		})

		res.json(docs)
    }).catch(err => {
        res.status(500).json(err)
    })
})

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	// Check for valid reward and user
	if (!req.body.reward || !req.body.user || !req.body.channel) {
		return res.status(400).send('Request contains invalid data.')
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
				reward: reward._id
			}).then(doc => {
				if (!doc) {
					ClaimModel.addReward(req.body.channel, req.body.msg, reward, user).then(doc => {
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
			ClaimModel.addReward(req.body.channel, req.body.msg, reward, user).then(doc => {
				res.status(201).send(doc)
			}).catch(err => {
				res.status(500).json(err)
			})
		}
	}).catch(err => {
        res.status(404).json(err)
    })
})

module.exports = router
