const mongoose = require('mongoose')

let ChannelSchema = new mongoose.Schema({
	tid: {
		type: String,
		required: true,
		unique: true
	},
	pointsName: {
		type: String,
		default: 'Coins'
	},
	pointsImg: {
		type: String,
		default: 'coins.png'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Channel', ChannelSchema)
