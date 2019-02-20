const mongoose = require('mongoose')

let ClaimSchema = new mongoose.Schema({
	reward: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Reward'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	points: Number,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Claim', ClaimSchema)
