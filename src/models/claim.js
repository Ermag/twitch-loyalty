const mongoose = require('mongoose')
const UserModel = require('./user')

let ClaimSchema = new mongoose.Schema({
	reward: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Reward'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	points: Number,
	msg: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

ClaimSchema.statics.addReward = function(channelId, message, reward, user) {
	return new Promise((resolve, reject) => {
		let newClaim = new this({
			reward: reward._id,
			user: user._id,
			channel: channelId,
			points: reward.points,
			msg: message || ''
		})

		newClaim.save().then(doc => {
			if (!doc || doc.length === 0) {
				reject(doc)
				return
			}

			UserModel.updateOne({
				_id: user._id
			}, {
				$inc: {
					points: reward.points < 0 ? reward.points *-1 : 0,
					currentPoints: reward.points *-1,
					experience: reward.points < 0 ? 0 : reward.points,
					claimedCount: 1
				},
				updatedAt: new Date()
			}, (err) => {
				 if (err) {
					reject(err)
					return
				 }

				 resolve(doc)
			})
		})

		// level up blalba
	})
}

module.exports = mongoose.model('Claim', ClaimSchema)
