const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	product: String,
	costBits: Number,
	points: Number,
	transactionId: String,
	transactionReceipt: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Payment', PaymentSchema)
