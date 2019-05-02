const cron = require('node-cron')
const axios = require('axios')
const APP_CONFIG = require('../constants')
const ChannelModel = require('../models/channel')
const ProfileModel = require('../models/profile')
const UserModel = require('../models/user')

const setPoints = () => {
	// console.log('Cron Points - ' + new Date().toString())

	// Get all the channels that are live
	return ChannelModel.find({
		isLive: true
	}).then(docs => {
		if (docs && docs.length) {
			// For every channel get active users
			docs.forEach(doc => {
				axios.get(`http://tmi.twitch.tv/group/user/${doc.name}/chatters`).then(res => {
					if (res.data && res.data.chatters) {
						let chatters = res.data.chatters
						let users = []

						Object.entries(chatters).forEach(obj => {
							users = users.concat(obj[1])
						})

						users = [...new Set(users)]

						ProfileModel.find({
							username: { $in: users }
						}).then(docs => {
							if (docs && docs.length) {
								users = []

								docs.forEach(doc => {
									users.push(doc._id)
								})

								for (let i = 0; i < 3; i++) {
									let updateQuery = {
										channel: doc._id,
										profile: { $in: users }
									}
									let incQuery = {
										points: 1,
										currentPoints: 1
									}

									if (i === 0) { // Normal
										incQuery.watchTime = 1
									}

									if (i === 1) { // Follower
										updateQuery.isFollowing = true
									}

									if (i === 2) { // Subscriber
										updateQuery.isSubscriber = true
										incQuery.points = 2
										incQuery.currentPoints = 2
									}

									UserModel.updateMany(updateQuery, {
										$inc: incQuery,
										updatedAt: new Date()
									}).then(() => {})
								}
							}
						})
					}
				})
			})
		}
	})
}

const setLiveChannels = () => {
	// console.log('Cron Live Channels - ' + new Date().toString())

	return axios.get(`https://api.twitch.tv/extensions/${APP_CONFIG.clientId}/live_activated_channels`, {
		headers: {
			'Client-ID': APP_CONFIG.clientId
		}
	}).then(res => {
		if (res.data && res.data.channels) {
			let channels = res.data.channels
			let channels2Update = []

			channels.forEach(channel => {
				channels2Update.push(channel.id)
			})

			// Get all the channels that are live
			ChannelModel.updateMany({}, {
				isLive: false,
				updatedAt: new Date()
			}).then(docs => {
				if (docs) {
					ChannelModel.updateMany({
						tid: { $in: channels2Update }
					}, {
						isLive: true,
						updatedAt: new Date()
					}).then(() => {})
				}
			})
		}
	})
}

module.exports = () => {
	// Every minute
	cron.schedule('* * * * *', () => {
		setPoints().catch(err => {
			console.log(err)
		})
	})

	// Every minute 30s
	cron.schedule('30 * * * * *', () => {
		setLiveChannels().catch(err => {
			console.log(err)
		})
	})
}
