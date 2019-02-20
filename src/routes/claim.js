const express = require('express')
const ClaimModel = require('../models/claim')
const RewardModel = require('../models/reward')
const UserModel = require('../models/user')
const router = express.Router()
const name = 'claim'

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	// Check for valid reward and user
	if (!req.body.reward || !req.body.user) {
		return res.status(400).send('Request contains invalid data.')
	}

	// Get the reward
	RewardModel.findOne({
		_id: req.body.reward,
		status: 1
    }).then(doc => {
		// Is the reward claimable once
		// Has the user got the points
		// Update experience base on formula
		// level up blalba
		// Deduct the points
		// Increment the claimed counter
		res.json(doc)
    }).catch(err => {
        res.status(404).json(err)
    })
})

module.exports = router
