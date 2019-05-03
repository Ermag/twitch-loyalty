const mongooseConnect = require('./services/mongoose')
const ProfileModel = require('./models/profile')
const UserModel = require('./models/user')

mongooseConnect().then(() => {
	UserModel.find().then(users => {
		users.forEach(user => {
			ProfileModel.findOne({
				userId: user.userId
			}).then(doc => {
				user.profile = doc._id
				user.save()
			})
		})
	})

	UserModel.distinct('userId').then(users => {
		users.forEach(user => {
			UserModel.findOne({
				userId: user,
			}).then(doc => {
				if (!doc) {
					return
				}

				let newProfile = new ProfileModel({
					userId: doc.userId,
					displayName: doc.displayName,
					username: doc.username,
					avatar: doc.avatar,
					level: doc.level,
					experience: doc.experience
				})

				newProfile.save().then(doc => {
					console.log(doc.userId)
				}).catch(err => {
					console.log(err)
				})
			})
		})
	})

	UserModel.distinct('userId').then(users => {
		users.forEach(user => {
			UserModel.findOne({
				userId: user,
			}).then(doc => {
				UserModel.find({
					userId: doc.userId,
					channel: doc.channel
				}).then(docs => {
					if (docs.length > 1) {
						for (let i = 0; i < docs.length; i++) {
							console.log(i, docs[i].userId, docs[i].channel)
							if (i > 0) {
								docs[i].remove()
							}
						}
					}
				})
			})
		})
	})
})
