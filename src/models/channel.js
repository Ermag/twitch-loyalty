const mongoose = require('mongoose')

let ChannelSchema = new mongoose.Schema({
	tid: { // Twitch Channel ID
		type: String,
		required: true,
		unique: true
	},
	pointsName: String,
	pointsImg: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Channel', ChannelSchema)
