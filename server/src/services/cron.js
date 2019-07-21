const cron = require('node-cron')
const setPoints = require('../crons/points')
const setLiveChannels = require('../crons/liveChannels')
const updateChannels = require('../crons/updateChannels')
const backup = require('../crons/backup')

module.exports = () => {
	// Every minute
	cron.schedule('* * * * *', () => {
		try {
			setPoints()
		} catch (err) {
			console.log(err)
		}
	})

	// Every minute 30s
	cron.schedule('30 * * * * *', () => {
		try {
			setLiveChannels()
		} catch (err) {
			console.log(err)
		}
	})

	// Every 30 minutes
	cron.schedule('*/30 * * * *', () => {
		try {
			updateChannels()
		} catch (err) {
			console.log(err)
		}
	})

	// Every day
	cron.schedule('30 11 * * *', () => {
		try {
			backup()
		} catch (err) {
			console.log(err)
		}
	})
}
