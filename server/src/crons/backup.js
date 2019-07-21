const fs = require('fs')
const BattleModel = require('../models/battle')
const ChannelModel = require('../models/channel')
const ClaimModel = require('../models/claim')
const PaymentModel = require('../models/payment')
const ProfileModel = require('../models/profile')
const RewardModel = require('../models/reward')
const UserModel = require('../models/user')

module.exports = async () => {
	console.time('Backup completed')

	let data = {}

	// Battle
	data = await BattleModel.find().lean()
	if (data.length) await fs.writeFile('backup/battles.json', JSON.stringify(data), () => {})

	// Channels
	data = await ChannelModel.find().lean()
	if (data.length) await fs.writeFile('backup/channels.json', JSON.stringify(data), () => {})

	// Claims
	data = await ClaimModel.find().lean()
	if (data.length) await fs.writeFile('backup/claims.json', JSON.stringify(data), () => {})

	// Payments
	data = await PaymentModel.find().lean()
	if (data.length) await fs.writeFile('backup/payments.json', JSON.stringify(data), () => {})

	// Profiles
	data = await ProfileModel.find().lean()
	if (data.length) await fs.writeFile('backup/profiles.json', JSON.stringify(data), () => {})

	// Rewards
	data = await RewardModel.find().lean()
	if (data.length) await fs.writeFile('backup/rewards.json', JSON.stringify(data), () => {})

	// Users
	data = await UserModel.find().lean()
	if (data.length) await fs.writeFile('backup/users.json', JSON.stringify(data), () => {})

	console.timeEnd('Backup completed')
}
