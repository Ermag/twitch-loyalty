<template>
	<v-app :dark="isDarkTheme">
		<div v-if="isLoading" class="ma-3 text-xs-center">
			<v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
		</div>
		<div v-else-if="hasError" class="my-2 mx-3 text-xs-center">
			<v-alert :value="true" color="error">
				<h3>Something went wrong :(<br>Please, try again later!</h3>
			</v-alert>
		</div>
		<div v-else>
			<v-alert v-if="!claims.length" :value="true" class="ma-0" color="info" icon="info">
				No rewards have been claimed yet.
			</v-alert>

			<div class="mb-2" v-for="claim in claims" :key="claim._id">
				<v-alert :value="true" class="ma-0" color="success" transition="scale-transition" outline>
					{{ claim.createdAt | moment('from', new Date()) }}
					<strong>{{ claim.user ? claim.user.displayName : 'Somebody' }} <sup class="primary--text">{{ claim.user ? claim.user.level : 1 }}</sup></strong> claimed <strong>{{ claim.reward.name }}</strong> for
					<Points :value="claim.points" :name="POINTS_NAME" :img="POINTS_IMG" />
					<v-divider class="my-1"></v-divider>
					{{ claim.msg || 'No Message left.' }}
				</v-alert>
			</div>
		</div>
	</v-app>
</template>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'
	import Points from './components/Points'

	export default {
		name: 'Live',
		components: {
			Points
		},
		data () {
			return {
				...APP_CONFIG,
				isDarkTheme: false,
				isLoading: true,
				hasError: false,
				channel: null,
				claims: [],
				fetchInterval: null,
				reFetchInterval: 30 // seconds
			}
		},
		methods: {
			fetchChannel () {
				this.axios.get(`${process.env.VUE_APP_API}channel?tid=${this.Auth.getChannelId()}`).then(res => {
					this.channel = res.data

					if (this.channel.pointsName) {
						this.POINTS_NAME = this.channel.pointsName
					}

					if (this.channel.pointsImg) {
						this.POINTS_IMG = this.channel.pointsImg
					}

					this.fetchData()
					this.setInterval()
				}).catch(() => {
					this.isLoading = false
					this.hasError = true
				})
			},
			fetchData () {
				this.axios.get(`${process.env.VUE_APP_API}claim?cid=${this.channel._id}`).then(res => {
					this.claims = res.data
					this.isLoading = false
					this.hasError = false
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
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

					this.fetchChannel()
				})
			}
		}
	}
</script>
