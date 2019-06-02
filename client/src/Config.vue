<template>
	<v-app :dark="isDarkTheme">
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
					<v-alert v-model="isNewInstall" color="success" icon="check_circle" dismissible>
						Thank you for installing {{ NAME }}! Below you can set rewards for your viewers, we ve hooked you up with our basic template to get you started.
						To set alerts or change your loyalty points name/image go to the <a href="#" @click="changeTab(1)">Options</a> tab.
					</v-alert>

					<v-alert v-model="isPointsInfo" color="info" icon="info" dismissible>
						Viewers start with <Points :value="STARTING_POINTS" :name="POINTS_NAME" :img="POINTS_IMG" /> and receive <strong style="font-size: 15px;">X</strong> amount every minute they watch your stream, based on their status.
						<table class="table pt-2">
							<thead>
								<tr>
									<th class="text-xs-left">Time/Status</th>
									<th>Minute</th>
									<th>Hour</th>
									<th>Day</th>
									<th>Week</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th class="text-xs-left">Viewer</th>
									<td class="text-xs-right"><Points :value="BASE_POINTS" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 60" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 1440" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 10080" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
								</tr>
								<tr>
									<th class="text-xs-left">Follower</th>
									<td class="text-xs-right"><Points :value="BASE_POINTS * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 60 * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 1440 * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 10080 * FOLLOWER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
								</tr>
								<tr>
									<th class="text-xs-left">Subscriber</th>
									<td class="text-xs-right"><Points :value="BASE_POINTS * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 60 * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 1440 * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
									<td class="text-xs-right"><Points :value="BASE_POINTS * 10080 * SUBSCRIBER_MULTIPLIER" :name="POINTS_NAME" :img="POINTS_IMG" /></td>
								</tr>
							</tbody>
						</table>
					</v-alert>

					<v-tabs v-model="tab" grow>
						<v-tabs-slider></v-tabs-slider>
						<v-tab v-for="tab in tabs" :key="tab" :disabled="tab === 'Analytics'">{{ tab }}</v-tab>

						<v-tab-item v-for="tab in tabs" :key="tab">
							<Rewards v-if="tab === 'Rewards'" :channel="channel" :changeTab="changeTab" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
							<Options v-if="tab === 'Options'" :channel="channel" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
						</v-tab-item>
					</v-tabs>
				</v-card>
			</v-flex>
		</v-layout>
	</v-app>
</template>

<style scoped lang="scss">
	.table thead th {
		padding: 0 20px 5px 0;
	}
	.table tbody td {
		padding-right: 20px;
	}
</style>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'
	import { EventBus } from './utils/event-bus'
	import Points from './components/Points'
	import Rewards from './components/config/Rewards'
	import Options from './components/config/Options'

	export default {
		name: 'Config',
		components: {
			Rewards,
			Options,
			Points
		},
		data () {
			return {
				...APP_CONFIG,
				isDarkTheme: false,
				isLoading: true,
				hasError: false,
				isNewInstall: !localStorage.getItem('loyal-config-dismissed_OFF'),
				isPointsInfo: true,
				isRewardDialog: false,
				channel: null,
				tab: null,
				tabs: ['Rewards', 'Options', 'Analytics']
			}
		},
		created () {
			this.twitch = window.Twitch ? window.Twitch.ext : null

			if (this.twitch) {
				this.twitch.onContext((context, delta) => {
					this.isDarkTheme = context.theme === 'dark'
				})

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
		},
		watch: {
			isNewInstall (val) {
				if (!val) {
					localStorage.setItem('loyal-config-dismissed', true)
				}
			}
		}
	}
</script>
