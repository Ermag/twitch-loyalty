<template>
	<div>
		<v-alert :value="true" class="ma-3" color="info" outline>
			You can see claimed rewards from viewers directly on your <a href="https://www.twitch.tv/dashboard/live" target="_blank">Twitch Dashboard</a>.<br /><br />
			To setup alerts for claimed rewards on your stream, please follow the instructions:
			<ol>
				<li>Open your streaming software (OBS, XSplit, etc.).</li>
				<li>Select the scene in which the alerts to appear.</li>
				<li>Add new browser source with Width -> 500 and Height - 320</li>
				<li>Copy and paste the URL -> <input :value="baseURL + 'alert.html?chid=' + channel._id + '&sound=yes&screenTime=8'" size="65" onClick="this.select(); document.execCommand('copy')" readonly autofocus /></li>
			</ol>
			<v-tooltip top>
				<template #activator="data">
					<v-btn v-on="data.on" color="primary" :disabled="isTesting" @click="sendTestAlert" outline>Test</v-btn>
				</template>
				<span>Could take 10-20 seconds for the alert to appear.</span>
			</v-tooltip>
		</v-alert>

		<div class="ma-3 pb-3">
			<h5 class="headline">
				Currency <Points :value="-1" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" />
			</h5>
			<v-form ref="addForm">
				<v-layout>
					<v-flex xs12 md4 class="px-2">
						<v-text-field label="Name" v-model="currencyName" :rules="[rules.required, rules.name]" maxlength="20" counter></v-text-field>
					</v-flex>
					<v-flex xs12 md4 class="px-2">
						<div>
							<v-text-field placeholder="Select PNG 24x24px" @click="pickFile()" label="Image"></v-text-field>
							<input
								type="file"
								style="display: none"
								ref="image"
								accept="image/*" />
						</div>

					</v-flex>
					<v-flex xs12 md4 class="px-2">
						<v-btn color="success" @click="save" block outline>Save</v-btn>
					</v-flex>
				</v-layout>
			</v-form>
		</div>

		<v-snackbar v-model="message.isVisible" :color="message.type" :timeout="message.timeout" top>
			{{ message.text }}
			<v-btn @click="message.isVisible = false" dark flat>Close</v-btn>
		</v-snackbar>
	</div>
</template>

<style lang="scss" scoped>
	input {
		border: 1px solid #000;
		color: #000;
		background: #FFF;
		margin-left: 5px;
		padding: 0px 3px;
	}
</style>

<script>
	import { EventBus } from '../utils/event-bus'
	import Points from './Points'

	export default {
		name: 'Options',
		props: ['channel', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				testRewardId: null,
				isTesting: false,
				baseURL: process.env.VUE_APP_API,
				currencyName: this.$props.POINTS_NAME,
				rules: {
					required: value => !!value || 'Required',
					name: value => (value && value.length <= 20) || 'Max 20 characters'
				},
				message: {
					isVisible: false,
					type: '',
					text: '',
					timeout: 6000
				}
			}
		},
		methods: {
			pickFile (type) {
				this.$refs['image'].click()
			},
			setMessage (type, text) {
				this.message.type = type
				this.message.text = text
				this.message.isVisible = true
			},
			sendTestAlert () {
				this.isTesting = true

				setTimeout(() => {
					this.isTesting = false
				}, 20000)

				if (!this.testRewardId) {
					this.axios.get(`${process.env.VUE_APP_API}reward/ref?name=test`).then(res => {
						this.testRewardId = res.data._id
						this.claimTestReward()
					})
				} else {
					this.claimTestReward()
				}
			},
			claimTestReward () {
				this.axios.post(`${process.env.VUE_APP_API}claimTest`, {
					reward: this.testRewardId,
					channel: this.channel._id
				})
			},
			save () {
				if (this.$refs.addForm.validate()) {
					let data = { name: this.currencyName }

					if (this.$refs['image'].files.length) {
						let reader = new FileReader()

						reader.onload = (e) => {
							let img = new Image()

							img.onload = () => {
								if (img.width !== 24 && img.height !== 24) {
									this.setMessage('error', 'Currency image size should be 24x24 pixels.')
									window.scrollTo(0, 0)
								} else {
									data = new FormData()
									data.append('name', this.currencyName)
									data.append('image', this.$refs['image'].files[0])

									this.axios.put(`${process.env.VUE_APP_API}channel?cid=${this.channel._id}`, data).then(res => {
										EventBus.$emit('channelChange', res.data)

										this.setMessage('success', 'You have successfuly changed your currency.')
									}).catch(() => {
										this.setMessage('error', 'Something went wrong :( Please, try again later.')
									})
								}
							}

							img.src = e.target.result
						}

						reader.readAsDataURL(this.$refs['image'].files[0])
					} else {
						this.axios.put(`${process.env.VUE_APP_API}channel?cid=${this.channel._id}`, data).then(res => {
							EventBus.$emit('channelChange', res.data)

							this.setMessage('success', 'You have successfuly changed your currency.')
						}).catch(() => {
							this.setMessage('error', 'Something went wrong :( Please, try again later.')
						})
					}
				}
			}
		}
	}
</script>
