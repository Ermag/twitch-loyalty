const cron = require('node-cron')
const axios = require('axios')
const APP_CONFIG = require('../constants')
const init = (timeFrame) => {
	cron.schedule(timeFrame, () => {
		console.log('Cron fire - ' + new Date().toString());

		axios.get(`https://api.twitch.tv/extensions/${APP_CONFIG.clientId}/live_activated_channels`, {
			headers: {
				'Client-ID': APP_CONFIG.clientId
			}
		}).then(res => {
			if (res.data && res.data.channels) {
				let channels = res.data.channels

				channels.array.forEach(channel => {

				})
				console.log(channels)
			}
		})
	})
}

module.exports = init
