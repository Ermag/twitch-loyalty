const axios = require('axios')
const ChannelModel = require('../models/channel')
const ProfileModel = require('../models/profile')
const UserModel = require('../models/user')

module.exports = async () => {
	// console.log('Cron Points - ' + new Date().toString())

	// Get all the channels that are live
	const channels = await ChannelModel.find({ isLive: true })

	if (channels && channels.length) {
		// For every channel get active users
		channels.forEach(async channel => {
			const twitchRes = await axios.get(`http://tmi.twitch.tv/group/user/${channel.name}/chatters`)

			if (twitchRes.data && twitchRes.data.chatters) {
				let chatters = twitchRes.data.chatters
				let users = []

				Object.entries(chatters).forEach(obj => {
					users = users.concat(obj[1])
				})

				users = [...new Set(users)]

				const profiles = await ProfileModel.find({ username: { $in: users } })

				if (profiles && profiles.length) {
					users = []

					profiles.forEach(doc => {
						users.push(doc._id)
					})

					for (let i = 0; i < 3; i++) {
						let updateQuery = {
							channel: channel._id,
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
			}
		})
	}
}
