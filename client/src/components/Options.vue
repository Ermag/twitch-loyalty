<template>
	<div>
		<v-alert :value="true" class="ma-3" color="info" outline>
			You can see claimed rewards from viewers directly on your <a href="https://www.twitch.tv/dashboard/live" target="_blank">Twitch Dashboard</a>.<br /><br />
			To setup alerts for claimed rewards on your stream, please follow the instructions:
			<ol>
				<li>Open your streaming software (OBS, XSplit, etc.).</li>
				<li>Select the scene in which the alerts to appear.</li>
				<li>Add new browser source.</li>
				<li>Copy and paste your URL. <input :value="baseURL + 'alert.html?chid=' + channel._id" size="60" onClick="this.select(); document.execCommand('copy')" readonly autofocus /></li>
			</ol>
			<v-btn color="primary" :disabled="isTesting" @click="sendTestAlert">Test</v-btn>
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
				isTesting: false,
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {
			sendTestAlert () {
				this.isTesting = true

				setTimeout(() => {
					this.isTesting = false
				}, 5000)

				// TODO: Send test claim
			}
		}
	}
</script>
