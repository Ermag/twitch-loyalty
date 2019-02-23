const mongoose = require('mongoose')

let RewardSchema = new mongoose.Schema({
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	name: String,
	ref: {
		type: String,
		trim: true,
		unique: true,
		sparse: true
	},
	points: Number,
	sound: String,
	image: String,
	claimedCount: {
		type: Number,
		default: 0
	},
	claimOnce: {
		type: Boolean,
		default: false
	},
	alert: {
		type: Boolean,
		default: true
	},
	status: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

RewardSchema.statics.cUpdateFiles = function(id, files) {
	return new Promise((resolve, reject) => {
		let promises = []

		if (files.image) {
			let imageFile = files.image
			let imageExt = imageFile.name.split('.').pop()
			let imageName = `ri-${id}.${imageExt}`
			let promiseImg = new Promise(function(resolve, reject) {
				imageFile.mv(`./public/${imageName}`, function(err)  {
					if (err) {
						return reject(err)
					} else {
						resolve(imageName)
					}
				})
			})

			promises.push(promiseImg)
		}

		if (files.sound) {
			let soundFile = files.sound
			let soundExt = soundFile.name.split('.').pop()
			let soundName = `rs-${id}.${soundExt}`
			let promiseSound = new Promise(function(resolve, reject) {
				soundFile.mv(`./public/${soundName}`, function(err) {
					if (err) {
						reject(err)
						return
					} else {
						resolve(soundName)
					}
				})
			})

			promises.push(promiseSound)
		}

		Promise.all(promises).catch(function(err) {
			reject(err)
		}).then(function(values) {
			resolve(values)
		})
	})
}

module.exports = mongoose.model('Reward', RewardSchema)
