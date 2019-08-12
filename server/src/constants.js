const CLIENT_ID = 'cx4rlgwlppmertltfy1dql4twr2cw6'
const APP_CONFIG = {
	clientId: CLIENT_ID,
	twitchSecret: 'jbWfPJaOHgKuQ5lWbYiG1ooRhhXhFajaFj44rEIumyU=',
	twitchOwnerId: '183052295',
	extensionURL: `https://www.twitch.tv/ext/${CLIENT_ID}-${process.env.npm_package_version}`
}

module.exports = APP_CONFIG
