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
					<v-btn v-on="data.on" color="primary" :disabled="isTesting" @click="sendTestAlert">Test</v-btn>
				</template>
				<span>Could take 10-20 seconds for the alert to appear.</span>
			</v-tooltip>
		</v-alert>
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
	export default {
		name: 'Options',
		props: ['channel'],
		data () {
			return {
				testRewardId: null,
				isTesting: false,
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {
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
			}
		}
	}
</script>
