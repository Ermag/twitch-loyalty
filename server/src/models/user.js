const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Profile'
	},
	isFollowing: {
		type: Boolean,
		default: false
	},
	isSubscriber: {
		type: Boolean,
		default: false
	},
	points: {
		type: Number,
		default: 0
	},
	currentPoints: {
		type: Number,
		default: 0
	},
	claimedCount: {
		type: Number,
		default: 0
	},
	battlesWon: {
		type: Number,
		default: 0
	},
	watchTime: {
		type: Number,
		default: 0
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

UserSchema.index({ channel: 1, profile: 1 }, { unique: true })

module.exports = mongoose.model('User', UserSchema)
