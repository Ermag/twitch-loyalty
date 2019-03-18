const cron = require('node-cron')
const axios = require('axios')
const APP_CONFIG = require('../constants')
const ChannelModel = require('../models/channel')
const UserModel = require('../models/user')
const setPoints = () => {
	console.log('Cron Points - ' + new Date().toString())

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

						// TODO: Update subscribers aswel
						for (let i = 0; i < 2; i++) {
							let points = (i === 0) ? 1 : 2

							UserModel.updateMany({
								channel: doc._id,
								username: { $in: users },
								isFollowing: Boolean(i)
							}, {
								$inc: {
									points: points,
									currentPoints: points,
									watchTime: 1
								},
								updatedAt: new Date()
							})
						}
					}
				})
			})
		}
	})
}
const setLiveChannels = () => {
	console.log('Cron Live Channels - ' + new Date().toString())

	return axios.get(`https://api.twitch.tv/extensions/${APP_CONFIG.clientId}/live_activated_channels`, {
		headers: {
			'Client-ID': APP_CONFIG.clientId
		}
	}).then(res => {
		if (res.data && res.data.channels) {
			let channels = res.data.channels
			let channels2Update = []

			channels.forEach(channel => {
				channels2Update.push(channel.username.toLowerCase())
			})

			// Get all the channels that are live
			ChannelModel.updateMany({}, {
				isLive: false,
				updatedAt: new Date()
			}).then(docs => {
				if (docs) {
					ChannelModel.updateMany({
						name: { $in: channels2Update }
					}, {
						isLive: true,
						updatedAt: new Date()
					})
				}
			})
		}
	})
}
const init = (timeFrame) => {
	cron.schedule(timeFrame, () => {
		setPoints().catch(err => {
			console.log(err)
		})
	})

	cron.schedule(timeFrame, () => {
		setLiveChannels().catch(err => {
			console.log(err)
		})
	})
}

module.exports = init
