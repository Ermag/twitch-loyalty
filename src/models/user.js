const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	userId: String,
	displayName: String,
	username: String,
	avatar: String,
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
	level: {
		type: Number,
		default: 1
	},
	experience: {
		type: Number,
		default: 0
	},
	claimedCount: {
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

module.exports = mongoose.model('User', UserSchema)
