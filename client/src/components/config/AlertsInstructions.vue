<style lang="scss" scoped>
	input {
		border-radius: 2px;
		background: #585858;
		margin-left: 5px;
		padding: 0px 3px;
		outline: none;
	}
</style>

<template>
	<div>
		<ol class="mb-3">
			<li>Open your streaming software (OBS, XSplit, etc.).</li>
			<li>Select the scene in which the alerts to appear.</li>
			<li>Add new browser source with Width -> 500 and Height - 320</li>
			<li>Copy and paste the URL: <input class="copy-url" :value="url" size="60" onClick="this.select(); document.execCommand('copy')" readonly /></li>
		</ol>

		<v-tooltip top>
			<template #activator="data">
				<v-btn v-on="data.on" color="primary" :disabled="isTesting" @click="sendTestAlert" outline>Send Test Alert</v-btn>
			</template>
			<span>Could take 10-20 seconds for the alert to appear.</span>
		</v-tooltip>
	</div>
</template>

<script>
	export default {
		name: 'AlertsInstructions',
		props: ['channel'],
		data () {
			return {
				testRewardId: null,
				isTesting: false,
				url: `${process.env.VUE_APP_API}alert.html?chid=${this.channel._id}&screenTime=8`
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
