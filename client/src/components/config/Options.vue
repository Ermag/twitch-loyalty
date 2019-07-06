<style lang="scss" scoped>
	input {
		border: 1px solid #000;
		color: #000;
		background: #FFF;
		margin-left: 5px;
		padding: 0px 3px;
	}
</style>

<template>
	<div>
		<div class="subheading ma-3 mb-4 pa-3" style="border: 1px solid #E5C572;">
			You can see claimed rewards from viewers directly on your <a href="https://www.twitch.tv/dashboard/live" target="_blank">Twitch Dashboard</a>.<br />
			To setup alerts for claimed rewards on your stream, please follow the instructions:
			<AlertsInstructions :channel="channel" />
		</div>

		<div class="ma-3 pb-4">
			<PointsChange :channel="channel" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />

			<h5 class="headline mt-4">Alerts Volume</h5>
			<v-flex xs12 class="mb-2">
				<v-slider
					v-model="alertsVolume"
					@change="changeAlertsVolume"
					@click:append="maxVolume"
					@click:prepend="minVolume"
					max="1"
					step="0.01"
					append-icon="volume_up"
					prepend-icon="volume_down"></v-slider>
			</v-flex>
		</div>
	</div>
</template>

<script>
	import AlertsInstructions from './AlertsInstructions'
	import PointsChange from './PointsChange'

	export default {
		name: 'Options',
		props: ['channel', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			AlertsInstructions,
			PointsChange
		},
		data () {
			return {
				alertsVolume: this.$props.channel.alertsVolume || 0.33,
				previewSound: new Audio(process.env.VUE_APP_API + 'default.wav')
			}
		},
		methods: {
			changeAlertsVolume (vol) {
				this.previewSound.currentTime = 0
				this.previewSound.volume = vol
				this.previewSound.play()

				this.axios.put(`${process.env.VUE_APP_API}channel?cid=${this.channel._id}`, { volume: vol })
			},
			maxVolume () {
				this.alertsVolume = 1
				this.changeAlertsVolume(this.alertsVolume)
			},
			minVolume () {
				this.alertsVolume = 0
				this.changeAlertsVolume(this.alertsVolume)
			}
		}
	}
</script>
