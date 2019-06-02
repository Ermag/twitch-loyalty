const express = require('express')
const jwt = require('jsonwebtoken')
const APP_CONFIG = require('../constants')
const PAYMENTS = require('../config/payments')
const UserModel = require('../models/user')
const PaymentModel = require('../models/payment')
const router = express.Router()
const name = 'payment'

// POST
router.post(`/${name}`, (req, res) => {
	if (!req.body) {
		return res.status(400).send('Request body is missing.')
	}

	jwt.verify(req.body.transactionReceipt, Buffer.from(APP_CONFIG.twitchSecret, 'base64'), (error, decoded) => {
		if (error || !decoded) {
			return res.status(401).send('Invalid receipt.')
		}

		// Find the user
		UserModel.findOne({
			_id: req.body.user
		}).then(doc => {
			if (!doc) {
				return res.status(404).send('User not found.')
			} else {
				PaymentModel.findOne({
					transactionId: decoded.data.transactionId
				}).then(payment => {
					if (payment) {
						return res.status(401).send('Nice try.')
					} else {
						let product = PAYMENTS[decoded.data.product.sku]

						if (!product) {
							return res.status(404).send('Product not found.')
						}

						let newPayment = new PaymentModel({
							channel: doc.channel,
							user: doc._id,
							product: decoded.data.product.sku,
							costBits: product.costBits,
							points: product.points,
							transactionId: decoded.data.transactionId,
							transactionReceipt: req.body.transactionReceipt
						})

						// Save the payment
						newPayment.save().then(payment => {
							// Add points to the user
							UserModel.updateOne({
								_id: doc._id
							}, {
								$inc: {
									points: payment.points,
									currentPoints: payment.points
								},
								updatedAt: new Date()
							}, err => {
								if (err) {
									return res.status(500).json(err)
								}

								res.json(payment.points)
							})
						}).catch(err => {
							res.status(500).json(err)
						})
					}
				}).catch(err => {
					res.status(500).json(err)
				})
			}
		}).catch(err => {
			res.status(500).json(err)
		})
	})
})

module.exports = router
