const mongoose = require('mongoose')
const axios = require('axios')
const APP_CONFIG = require('../constants')
const REWARDS = require('../config/rewards')
const RewardModel = require('../models/reward')

let ChannelSchema = new mongoose.Schema({
	tid: { // Twitch Channel ID
		type: String,
		required: true,
		unique: true
	},
	name: String,
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

ChannelSchema.statics.cAddNew = function(tid) {
	return new Promise((resolve, reject) => {
		axios.get(`https://api.twitch.tv/kraken/channels/${tid}`, {
			headers: {
				'Accept': 'application/vnd.twitchtv.v5+json',
				'Client-ID': APP_CONFIG.clientId
			}
		}).then(res => {
			if (!res.data) {
				reject('Can\'t get channel data.')
				return
			}

			let newChannel = new this({
				tid: tid,
				name: res.data.name
			})

			newChannel.save().then(doc => {
				if (!doc || doc.length === 0) {
					reject(doc)
					return
				}

				// Add default rewards
				let defaultRewards = []
				REWARDS.defaults.forEach(e => {
					defaultRewards.push({
						...e,
						channel: doc._id
					})
				})

				RewardModel.create(defaultRewards, function (err) {
					if (err) {
						reject(err)
					}

					resolve(doc)
				})
			}).catch(err => {
				reject(err)
			})
		}).catch(err => {
			reject(err)
		})
	})
}

module.exports = mongoose.model('Channel', ChannelSchema)
