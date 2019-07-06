<style lang="scss">
	@import './styles/_vars';
	@import './styles/main';

	.table thead th {
		padding: 0 20px 5px 0;
	}
	.table tbody td {
		padding-right: 20px;
	}
</style>

<template>
	<v-app :dark="true" style="overflow: auto;">
		<div v-if="isLoading" class="ma-3 text-xs-center">
			<v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
		</div>
		<div v-else-if="hasError" class="ma-3 text-xs-center">
			<v-alert :value="true" color="error">
				Something went wrong :( Please, try again later!
			</v-alert>
		</div>
		<v-layout v-else>
			<v-flex sm12 md8 offset-md2>
				<v-card>
					<v-tabs v-model="tab" grow>
						<v-tabs-slider></v-tabs-slider>
						<v-tab class="title" v-for="tab in tabs" :key="tab" :disabled="tab === 'Analytics'">{{ tab }}</v-tab>

						<v-tab-item v-for="tab in tabs" :key="tab">
							<Rewards v-if="tab === 'Rewards'" :channel="channel" :changeTab="changeTab" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
							<Options v-if="tab === 'Options'" :channel="channel" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
						</v-tab-item>
					</v-tabs>
				</v-card>
			</v-flex>

			<IntroModal :channel="channel" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
		</v-layout>
	</v-app>
</template>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'
	import { EventBus } from './utils/event-bus'
	import IntroModal from './components/config/Intro'
	import Rewards from './components/config/Rewards'
	import Options from './components/config/Options'

	export default {
		name: 'Config',
		components: {
			IntroModal,
			Rewards,
			Options
		},
		data () {
			return {
				...APP_CONFIG,
				isLoading: true,
				hasError: false,
				isRewardDialog: false,
				channel: null,
				tab: null,
				tabs: ['Rewards', 'Options', 'Analytics']
			}
		},
		created () {
			this.twitch = window.Twitch ? window.Twitch.ext : null

			if (this.twitch) {
				this.twitch.onAuthorized(auth => {
					this.Auth = new Authentication(auth)

					if (this.Auth.isAuthenticated()) {
						this.axios.defaults.headers.common['Content-Type'] = 'application/json'
						this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.Auth.getToken()}`
						this.fetchChannel()
					}
				})
			}

			EventBus.$on('channelChange', channel => {
				this.setChannel(channel)
				this.POINTS_IMG = this.POINTS_IMG + '?time=' + Date.now()
			})
		},
		methods: {
			setChannel (data) {
				this.channel = data

				if (this.channel.pointsName) {
					this.POINTS_NAME = this.channel.pointsName
				}

				if (this.channel.pointsImg) {
					this.POINTS_IMG = this.channel.pointsImg
				}
			},
			fetchChannel () {
				this.axios.get(`${process.env.VUE_APP_API}channel?tid=${this.Auth.getChannelId()}`).then(res => {
					this.setChannel(res.data)
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
			},
			changeTab (tab) {
				this.tab = tab
			}
		}
	}
</script>
