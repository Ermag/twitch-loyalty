<template>
	<v-app :dark="isDarkTheme">
		<div v-if="isLoading" class="ma-3 text-xs-center">
			<v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
		</div>
		<div v-else>
			<v-alert v-if="!notifications.length" :value="true" class="ma-0" color="info" icon="info">
				No rewards have been claimed yet.
			</v-alert>

			<div class="mb-2" v-for="notification in notifications" :key="notification.id">
				<v-alert :value="true" class="ma-0" color="success" icon="flag" transition="scale-transition" outline>
					<strong>{{ notification.by }}</strong> claimed {{ notification.name }} for {{ notification.cost }}!
				</v-alert>
			</div>
		</div>
	</v-app>
</template>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'

	export default {
		name: 'Live',
		data () {
			return {
				...APP_CONFIG,
				isDarkTheme: false,
				isLoading: true,
				notifications: [
					{ id: 0, name: 'Test 1', by: 'Goshko', cost: 10 },
					{ id: 1, name: 'Test 2', by: 'Toshko', cost: 50 }
				],
				fetchInterval: null,
				reFetchInterval: 5 // seconds
			}
		},
		methods: {
			fetchData () {
				this.isLoading = true
				// TODO:
			},
			setInterval () {
				clearInterval(this.fetchInterval)

				this.fetchInterval = setInterval(e => {
					this.fetchData()
				}, this.reFetchInterval * 1000)
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
					}

					this.fetchData()
					this.setInterval()
				})
			}
		}
	}
</script>
