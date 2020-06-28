const CLIENT_ID = ''
const APP_CONFIG = {
	clientId: CLIENT_ID,
	twitchSecret: '',
	twitchOwnerId: '',
	extensionURL: `https://www.twitch.tv/ext/${CLIENT_ID}-${process.env.npm_package_version}`
}

module.exports = APP_CONFIG
