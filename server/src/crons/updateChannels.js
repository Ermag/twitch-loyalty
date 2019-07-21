const axios = require('axios')
const APP_CONFIG = require('../constants')
const ChannelModel = require('../models/channel')

module.exports = async () => {
	// console.log('Cron Update Channels - ' + new Date().toString())

	// Get all the channels that are live
	const twitchRes = await axios.get(`https://api.twitch.tv/extensions/${APP_CONFIG.clientId}/live_activated_channels`, {
		headers: {
			'Client-ID': APP_CONFIG.clientId
		}
	})

	if (twitchRes.data && twitchRes.data.channels) {
		const liveChannels = twitchRes.data.channels

		liveChannels.forEach(async channel => {
			const channelRes = await axios.get(`https://api.twitch.tv/kraken/channels/${channel.id}`, {
				headers: {
					'Accept': 'application/vnd.twitchtv.v5+json',
					'Client-ID': APP_CONFIG.clientId
				}
			})

			if (channelRes.data) {
				await ChannelModel.findOneAndUpdate({
					tid: channel.id
				}, {
					name: channelRes.data.name,
					updatedAt: new Date()
				})
			}
		})
	}
}
