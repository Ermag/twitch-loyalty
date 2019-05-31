const mongoose = require('mongoose')
const ProfileModel = require('./profile')
const UserModel = require('./user')
const RewardModel = require('./reward')

const ClaimSchema = new mongoose.Schema({
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

ClaimSchema.statics.addClaim = function (channelId, message, reward, user) {
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

			RewardModel.updateOne({
				_id: reward._id
			}, {
				$inc: {
					claimedCount: 1
				},
				updatedAt: new Date()
			}, () => { })

			if (!user) {
				resolve(doc)
				return
			}

			let exp = reward.points < 0 ? 0 : reward.points
			let isLevelUp = false
			let expNextLevel = Math.round(175 * Math.pow(user.profile.level + 1, 1.5))

			// Check for level up
			if (user.profile.experience + exp >= expNextLevel) {
				isLevelUp = true
			}

			Promise.all([
				ProfileModel.updateOne({
					_id: user.profile._id
				}, {
					$inc: {
						experience: exp,
						level: isLevelUp ? 1 : 0
					},
					updatedAt: new Date()
				}),
				UserModel.updateOne({
					_id: user._id
				}, {
					$inc: {
						points: reward.points < 0 ? reward.points * -1 : 0,
						currentPoints: reward.points * -1,
						claimedCount: 1
					},
					updatedAt: new Date()
				})
			]).then(() => {
				resolve({})
			}).catch(err => {
				reject(err)
			})
		})
	})
}

module.exports = mongoose.model('Claim', ClaimSchema)
