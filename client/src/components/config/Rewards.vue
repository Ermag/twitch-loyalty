<template>
	<div>
		<div style="display: flex; align-items: center;">
			<h5 class="headline pa-3" style="flex-grow: 1;">Total - {{ rewards.data.length }}</h5>
			<v-tooltip top>
				<template #activator="data">
					<div v-on="data.on" class="pr-2">
						<v-btn color="primary" @click="openRewardDialog()" :disabled="rewards.data.length >= 25" outline>Add New</v-btn>
					</div>
				</template>
				<span>Limit is 25 rewards.</span>
			</v-tooltip>
		</div>
		<v-divider></v-divider>

		<v-data-table class="elevation-1"
			:headers="rewards.headers"
			:items="rewards.data"
			:loading="rewards.isLoading"
			item-key="name"
			disable-initial-sort
			hide-actions>
			<template slot="headers" slot-scope="props">
				<tr>
					<th v-for="header in props.headers" :key="header.text">
						{{ header.text }}
					</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props">
				<tr>
					<td>
						{{ props.item.name }}
						<v-btn class="ma-0 mx-1" @click="viewImage(props.item)" flat icon small>
							<v-icon small>insert_photo</v-icon>
						</v-btn>
						<v-btn class="ma-0" @click="toggleSound(props.item.sound)" flat icon small>
							<v-icon small>volume_up</v-icon>
						</v-btn>
					</td>
					<td class="text-xs-right"><Points :value="props.item.points" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
					<td class="text-xs-center"><a @click="changeTab(1)">{{ props.item.alert ? 'Yes' : 'No' }}</a></td>
					<td class="text-xs-right">{{ props.item.claimedCount }} times</td>
					<td class="text-xs-center">
						<v-btn color="info" @click="openRewardDialog(props.item)" icon flat><v-icon>edit</v-icon></v-btn>
						<v-btn color="error" @click="openDeleteDialog(props.item)" icon flat><v-icon>delete</v-icon></v-btn>
					</td>
				</tr>
			</template>
		</v-data-table>

		<v-dialog v-model="isRewardDialog" max-width="600px" persistent>
			<v-card>
				<v-card-title class="headline grey darken-2" primary-title>
					<span style="color: #FFF;">{{ reward.id === false ? 'Add' : 'Edit' }} Reward</span>
				</v-card-title>

				<v-card-text>
					<v-alert :value="true" color="info" icon="info" outline>
						Try adding creative rewards for your viwers, like playing a game together, do a challenge, show a magic trick, draw, play music etc.
					</v-alert>

					<v-form ref="addForm">
						<v-container grid-list-md>
							<v-layout wrap>
								<v-flex xs12>
									<v-text-field
										v-model="reward.name"
										:rules="[reward.rules.required, reward.rules.name]"
										label="Name*" maxlength="120" counter autofocus></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										v-model="reward.cost"
										:rules="[reward.rules.cost]"
										type="number" label="Cost*"></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-switch v-model="reward.alert" label="Show Alert" color="success"></v-switch>
								</v-flex>
								<v-flex xs6>
									<v-text-field v-model="reward.image.name" @click="pickFile('image')" label="Select Image (Max 2MB)" prepend-icon="insert_photo"></v-text-field>
									<input type="file" ref="image" accept="image/*" style="display: none;" @change="onFilePicked($event, 'image')" />
								</v-flex>
								<v-flex xs6>
									<v-text-field v-model="reward.sound.name" @click="pickFile('sound')" label="Select Sound (Max 2MB)" prepend-icon="volume_up"></v-text-field>
									<input type="file" ref="sound" accept="audio/*" style="display: none;" @change="onFilePicked($event, 'sound')" />
								</v-flex>
							</v-layout>
						</v-container>
					</v-form>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="success" @click="saveReward" flat>Save</v-btn>
					<v-btn color="grey" @click="isRewardDialog = false" flat>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="isDeleteDialog" width="500">
			<v-card>
				<v-card-title class="headline grey darken-2" primary-title>
					<span style="color: #FFF;">Confirmation</span>
				</v-card-title>

				<v-card-text>Are you sure you want to delete this reward?</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="removeReward" flat>Yes</v-btn>
					<v-btn color="grey" @click="isDeleteDialog = false" flat>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="isViewImage" width="400">
			<v-card>
				<v-card-text class="text-xs-center">
					<img :src="imageToView" height="150" />
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="grey" @click="isViewImage = false" flat>Close</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar v-model="message.isVisible" :color="message.type" :timeout="message.timeout" top>
			{{ message.text }}
			<v-btn @click="message.isVisible = false" dark flat>Close</v-btn>
		</v-snackbar>
	</div>
</template>

<script>
	import Points from '../Points'

	export default {
		name: 'Rewards',
		components: {
			Points
		},
		props: ['channel', 'changeTab', 'POINTS_NAME', 'POINTS_IMG'],
		data () {
			return {
				isRewardDialog: false,
				isDeleteDialog: false,
				toDelete: null,
				isViewImage: false,
				imageToView: null,
				previewSound: new Audio(''),
				baseURL: process.env.VUE_APP_API,
				message: {
					isVisible: false,
					type: '',
					text: '',
					timeout: 6000
				},
				reward: {
					_id: false,
					name: '',
					cost: 0,
					alert: true,
					image: {},
					sound: {},
					rules: {
						required: value => !!value || 'Required',
						name: value => (value && value.length <= 120) || 'Max 120 characters',
						cost: value => value > 0 || 'Minimum amount is 1'
					}
				},
				rewards: {
					isLoading: false,
					headers: [
						{ text: 'Name', value: 'name' },
						{ text: 'Cost', value: 'cost' },
						{ text: 'Alert', value: 'protein' },
						{ text: 'Claimed', value: 'claimed' },
						{ text: 'Options', value: 'options' }
					],
					data: []
				}
			}
		},
		methods: {
			toggleSound (sound) {
				sound = sound || 'default.wav'
				this.previewSound.currentTime = 0

				if (sound === this.previewSound.alterSrc) {
					this.previewSound.paused ? this.previewSound.play() : this.previewSound.pause()
				} else {
					this.previewSound.src = this.baseURL + sound
					this.previewSound.alterSrc = sound

					this.previewSound.play()
				}
			},
			viewImage (reward) {
				this.imageToView = process.env.VUE_APP_API + (reward.image || 'default.png')
				this.isViewImage = true
			},
			setMessage (type, text) {
				this.message.type = type
				this.message.text = text
				this.message.isVisible = true
			},
			openRewardDialog (reward) {
				if (!reward) {
					this.reward.id = false
					this.reward.name = ''
					this.reward.cost = 1
					this.reward.alert = true
				} else {
					this.reward.id = reward._id
					this.reward.name = reward.name
					this.reward.cost = reward.points
					this.reward.alert = reward.alert
				}

				this.$refs['image'].value = ''
				this.reward.image = {}
				this.$refs['sound'].value = ''
				this.reward.sound = {}

				this.isRewardDialog = true
			},
			pickFile (type) {
				this.$refs[type].click()
			},
			onFilePicked (e, type) {
				const files = e.target.files

				if (files[0] !== undefined) {
					if (files[0].name.lastIndexOf('.') <= 0) {
						return
					}

					const fr = new FileReader()

					fr.readAsDataURL(files[0])
					fr.addEventListener('load', () => {
						this.reward[type] = {
							name: files[0].name,
							url: fr.result,
							file: files[0]
						}
					})
				} else {
					this.reward[type] = false
				}
			},
			saveReward () {
				if (this.$refs.addForm.validate()) {
					let data

					if (this.$refs['image'].files.length || this.$refs['sound'].files.length) {
						data = new FormData()
						data.append('name', this.reward.name)
						data.append('points', this.reward.cost)
						data.append('alert', this.reward.alert)

						if (!this.reward.id) {
							data.append('channel', this.channel._id)
						}

						if (this.$refs['image'].files.length) {
							data.append('image', this.$refs['image'].files[0])
						}

						if (this.$refs['sound'].files.length) {
							data.append('sound', this.$refs['sound'].files[0])
						}
					} else {
						data = {
							name: this.reward.name,
							points: this.reward.cost,
							alert: this.reward.alert
						}

						if (!this.reward.id) {
							data.channel = this.channel._id
						}
					}

					// Update or create
					if (this.reward.id) {
						this.axios.put(`${process.env.VUE_APP_API}reward?id=${this.reward.id}`, data).then(res => {
							let rewardIndex = this.rewards.data.findIndex(reward => reward._id === this.reward.id)
							this.rewards.data[rewardIndex].name = res.data.name
							this.rewards.data[rewardIndex].points = res.data.points
							this.rewards.data[rewardIndex].alert = res.data.alert
							this.rewards.data[rewardIndex].image = res.data.image
							this.rewards.data[rewardIndex].sound = res.data.sound

							this.setMessage('success', 'You have successfuly edited the reward.')
						}).catch(() => {
							this.setMessage('error', 'Something went wrong :( Please, try again later.')
						}).then(() => {
							this.isRewardDialog = false
							window.scrollTo(0, 0)
						})
					} else {
						this.axios.post(`${process.env.VUE_APP_API}reward`, data).then(res => {
							this.rewards.data.unshift(res.data)
							this.setMessage('success', 'You have successfuly added a new reward.')
						}).catch(() => {
							this.setMessage('error', 'Something went wrong :( Please, try again later.')
						}).then(() => {
							this.isRewardDialog = false
							window.scrollTo(0, 0)
						})
					}
				}
			},
			openDeleteDialog (reward) {
				this.isDeleteDialog = true
				this.toDelete = reward._id
			},
			fetchRewards () {
				this.rewards.isLoading = true

				this.axios.get(`${process.env.VUE_APP_API}reward?cid=${this.channel._id}`).then(res => {
					this.rewards.data = res.data
				}).catch(() => {
					this.setMessage('error', 'Could not load reward list :( Please, try again later.')
				}).then(() => {
					this.rewards.isLoading = false
				})
			},
			removeReward () {
				this.axios.delete(`${process.env.VUE_APP_API}reward?id=${this.toDelete}`).then(res => {
					this.rewards.data = this.rewards.data.filter(reward => {
						return this.toDelete !== reward._id
					})

					this.setMessage('success', 'You have successfuly deleted the reward.')
				}).catch(() => {
					this.setMessage('error', 'Could not delete reward :( Please, try again later.')
				}).then(() => {
					this.isDeleteDialog = false
				})
			}
		},
		created () {
			this.previewSound.volume = 0.25

			this.fetchRewards()
		}
	}
</script>
