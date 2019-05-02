const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
	userId: {
		type: String,
		unique: true
	},
	displayName: String,
	username: String,
	avatar: String,
	level: {
		type: Number,
		default: 1
	},
	experience: {
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

module.exports = mongoose.model('Profile', ProfileSchema)
