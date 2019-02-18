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
						Thank you for installing {{ NAME }}!<br />
						Below you can set rewards for your viewers, we ve hooked you up with our basic template to get you started.
					</v-alert>

					<v-alert v-model="isPointsInfo" color="info" icon="info" dismissible>
						Viewers start with {{ STARTING_POINTS }} {{ POINTS_NAME }} and receive X amount every minute they watch your stream.
						<table class="table pt-2">
							<thead>
								<tr>
									<th>Watch Time/Rank</th>
									<th>Minute</th>
									<th>Hour</th>
									<th>Day</th>
									<th>Week</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th class="text-xs-left">Viewer</th>
									<td class="text-xs-right">{{ BASE_POINTS }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 60 }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 1440 }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 10080 }}</td>
								</tr>
								<tr>
									<th class="text-xs-left">Follower</th>
									<td class="text-xs-right">{{ BASE_POINTS * FOLLOWER_MULTIPLIER }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 60 * FOLLOWER_MULTIPLIER }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 1440 * FOLLOWER_MULTIPLIER }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 10080 * FOLLOWER_MULTIPLIER }}</td>
								</tr>
								<tr>
									<th class="text-xs-left">Subscriber </th>
									<td class="text-xs-right">{{ BASE_POINTS * SUBSCRIBER_MULTIPLIER }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 60 * SUBSCRIBER_MULTIPLIER }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 1440 * SUBSCRIBER_MULTIPLIER }}</td>
									<td class="text-xs-right">{{ BASE_POINTS * 10080 * SUBSCRIBER_MULTIPLIER }}</td>
								</tr>
							</tbody>
						</table>
					</v-alert>

					<v-tabs v-model="tab" grow>
						<v-tabs-slider></v-tabs-slider>
						<v-tab v-for="tab in tabs" :key="tab" :disabled="tab !== 'Rewards'">{{ tab }}</v-tab>

						<v-tab-item v-for="tab in tabs" :key="tab">
							<Rewards />
						</v-tab-item>
					</v-tabs>
				</v-card>
			</v-flex>
		</v-layout>
	</v-app>
</template>

<style scoped lang="scss">
	.table thead th {
		padding: 0 15px 5px 0;
	}
	.table tbody td {
		padding-right: 15px;
	}
</style>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'
	import Rewards from './components/Rewards'

	export default {
		name: 'Config',
		components: {
			Rewards
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
				tab: null,
				tabs: ['Rewards', 'Analytics', 'Options']
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
		},
		methods: {
			fetchChannel () {
				this.axios.get(`${process.env.VUE_APP_API}channel?tid=${this.Auth.getChannelId()}`).then(res => {
					console.log(res.data)
					this.POINTS_NAME = res.data.pointsName
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
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
