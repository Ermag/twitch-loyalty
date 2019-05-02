const mongoose = require('mongoose')

const BattleSchema = new mongoose.Schema({
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	opponent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	points: Number,
	userMove: Number,
	opponentMove: Number,
	result: Number,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Battle', BattleSchema)
