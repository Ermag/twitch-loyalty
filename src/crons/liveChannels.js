const axios = require('axios')
const APP_CONFIG = require('../constants')
const ChannelModel = require('../models/channel')

module.exports = async () => {
	// console.log('Cron Live Channels - ' + new Date().toString())

	// Get all the channels that are live
	const twitchRes = await axios.get(`https://api.twitch.tv/extensions/${APP_CONFIG.clientId}/live_activated_channels`, {
		headers: {
			'Client-ID': APP_CONFIG.clientId
		}
	})

	if (twitchRes.data && twitchRes.data.channels) {
		const liveChannels = twitchRes.data.channels
		let channels2Update = []

		liveChannels.forEach(channel => {
			channels2Update.push(channel.id)
		})

		const channels = await ChannelModel.updateMany({}, {
			isLive: false,
			updatedAt: new Date()
		})

		if (channels) {
			ChannelModel.updateMany({
				tid: { $in: channels2Update }
			}, {
				isLive: true,
				updatedAt: new Date()
			}).then(() => {})
		}
	}
}
