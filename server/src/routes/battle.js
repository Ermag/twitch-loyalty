const express = require('express')
const BattleModel = require('../models/battle')
const UserModel = require('../models/user')
const router = express.Router()
const name = 'battle'

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	let points = parseInt(req.body.points)
	let userMove = parseInt(req.body.userMove)
	let opponentMove = Math.floor(Math.random() * 3) + 1

	// Check for valid params
	if (!req.body.user || (points <= 0 || points > 50) || (userMove < 1 || userMove > 3)) {
		return res.status(400).send('Request contains invalid data.')
	}

	// Find the user
	UserModel.findOne({
		_id: req.body.user
	}).then(doc => {
		if (!doc) {
			return res.status(404).send('User not found.')
		} else {
			// Check for enough points
			if (doc.currentPoints < points) {
				return res.status(409).json('Not enough points to battle.')
			}

			let result = 0 // Lost

			if (userMove === opponentMove) {
				result = 2 // Draw
			} else if (
				(userMove === 1 && opponentMove === 2) || // Rocks vs Sis
				(userMove === 2 && opponentMove === 3) || // Sis vs Paper
				(userMove === 3 && opponentMove === 1) // Paper vs Rock
			) {
				result = 1 // Win
			}

			// Count battles
			let now = new Date()
			let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

			BattleModel.find({
				channel: doc.channel,
				user: doc._id,
				createdAt: { $gte: startOfToday }
			}).exec(function (err, count) {
				if (err) {
					return res.status(404).send(err)
				}

				if (count.length > 10) {
					return res.status(422).send('Maximum allowed battles per day is 10.')
				}

				// Don't do anything on draw
				if (result === 2) {
					return res.json({ result, opponentMove })
				}

				let newBattle = new BattleModel({
					channel: doc.channel,
					user: doc._id,
					opponent: req.body.opponent,
					points: points,
					userMove: userMove,
					opponentMove: opponentMove,
					result: result
				})

				// Save the battle
				newBattle.save().then(battle => {
					let exp = result === 0 ? points : 0
					let isLevelUp = false
					let expNextLevel = Math.round(175 * Math.pow(doc.level + 1, 1.5))

					// Check for level up
					if (doc.experience + exp >= expNextLevel) {
						isLevelUp = true
					}

					// Update the user
					UserModel.updateOne({
						_id: doc._id
					}, {
						$inc: {
							points: result === 1 ? points * 2 : 0,
							currentPoints: result === 1 ? points * 2 : points * -1,
							experience: exp,
							level: isLevelUp ? 1 : 0,
							battlesWon: result === 1 ? 1 : 0
						},
						updatedAt: new Date()
					}, (err) => {
						if (err) {
							return res.status(500).json(err)
						}

						res.json(battle)
					})
				}).catch(err => {
					res.status(500).json(err)
				})
			})
		}
	}).catch(err => {
		res.status(500).json(err)
	})
})

module.exports = router
