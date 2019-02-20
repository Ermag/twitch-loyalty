const mongoose = require('mongoose')

let RewardSchema = new mongoose.Schema({
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	name: String,
	ref: {
		type: String,
		unique: true
	},
	points: Number,
	sound: String,
	image: String,
	claimedCount: {
		type: Number,
		default: 0
	},
	claimOnce: {
		type: Boolean,
		default: false
	},
	alert: {
		type: Boolean,
		default: true
	},
	status: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Reward', RewardSchema)
