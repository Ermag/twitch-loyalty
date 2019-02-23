const express = require('express')
const REWARDS = require('../config/rewards')
const RewardModel = require('../models/reward')
const router = express.Router()
const name = 'reward'

// GET
router.get(`/${name}`, (req, res) => {
    if (!req.query.cid) {
		return res.status(400).send('Missing valid channel ID.')
	}

    RewardModel.find({
		channel: req.query.cid,
		status: 1
    }).sort('-createdAt').then(doc => {
		res.json(doc)
    }).catch(err => {
        res.status(500).json(err)
    })
})

// GET by ref
router.get(`/${name}/ref`, (req, res) => {
    if (!req.query.name) {
		return res.status(400).send('Missing valid reference.')
	}

    RewardModel.findOne({
		ref: req.query.name,
		status: 1
    }).then(doc => {
		res.json(doc)
    }).catch(err => {
        res.status(404).json(err)
    })
})

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	// Check for valid name and points
	if (!req.body.name || !req.body.name.length > 120 || req.body.points <= 0) {
		return res.status(400).send('Request contains invalid data.')
	}

	RewardModel.find({
		channel: req.body.channel,
		status: 1
    }).then(docs => {
		if (docs && docs.length >= REWARDS.limit) {
			return res.status(422).send('Maximum amount of reward reached for that channel.')
		} else {
			let newReward = new RewardModel({
				channel: req.body.channel,
				name: req.body.name,
				points: req.body.points,
				alert: req.body.alert
			})

			newReward.save().then(doc => {
				if (!doc || doc.length === 0) {
					return res.status(500).send(doc)
				}

				if (req.files) {
					RewardModel.cUpdateFiles(doc._id, req.files).then(files => {
						let data = {}

						if (files[0]) {
							data.image = files[0]
						}

						if (files[1]) {
							data.sound = files[1]
						}

						RewardModel.findOneAndUpdate({
							_id: doc._id
						}, {
							...data
						}, {
							new: true
						}).then(doc => {
							if (!doc || doc.length === 0) {
								return res.status(500).send(doc)
							}

							res.status(201).send(doc)
						}).catch(err => {
							res.status(500).json(err)
						})
					}).catch(err => {
						res.status(500).json(err)
					})
				} else {
					res.status(201).send(doc)
				}
			}).catch(err => {
				res.status(500).json(err)
			})
		}
    }).catch(err => {
        res.status(500).json(err)
    })
})

// UPDATE
router.put(`/${name}`, (req, res) => {
	if (!req.query.id) {
		return res.status(400).send('Missing reward id.')
	}

	// Check for valid name and points
	if (!req.body.name || !req.body.name.length > 120 || parseInt(req.body.points) <= 0) {
		return res.status(400).send('Request contains invalid data.')
	}

	function update(data) {
		RewardModel.findOneAndUpdate({
			_id: req.query.id
		}, {
			...data,
			name: req.body.name,
			points: req.body.points,
			alert: req.body.alert,
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

	if (req.files) {
		RewardModel.cUpdateFiles(req.query.id, req.files).then(files => {
			let data = {}

			if (files[0]) {
				data.image = files[0]
			}

			if (files[1]) {
				data.sound = files[1]
			}

			update(data)
		}).catch(err => {
			res.status(500).json(err)
		})
	} else {
		update()
	}
})

// DELETE
router.delete(`/${name}`, (req, res) => {
	if (!req.query.id) {
		return res.status(400).send('Missing reward id.')
	}

	RewardModel.findOneAndUpdate({
		_id: req.query.id
	}, {
		status: 0,
		updatedAt: new Date()
	}).then(doc => {
		if (!doc || doc.length === 0) {
			return res.status(500).send(doc)
		}

		res.json(doc)
	}).catch(err => {
		res.status(500).json(err)
	})
})

module.exports = router
