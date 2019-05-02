<template>
	<v-app :dark="isDarkTheme">
		<v-alert v-model="hasNewVersion" color="info" icon="info" dismissible>
			A new version of <strong>Alter</strong> has been rolled out, click  <a href="#" @click="isChangelogModal = true">HERE</a> to see the changelog.
		</v-alert>

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
					<strong>{{ claim.user ? claim.user.profile.displayName : 'Somebody' }} <sup class="primary--text">{{ claim.user ? claim.user.profile.level : 1 }}</sup></strong> claimed <strong>{{ claim.reward.name }}</strong> for
					<Points :value="claim.points" :name="POINTS_NAME" :img="POINTS_IMG" />
					<v-divider class="my-1"></v-divider>
					{{ claim.msg || 'No Message left.' }}
				</v-alert>
			</div>
		</div>

		<v-dialog v-model="isChangelogModal" fullscreen>
			<v-card>
				<v-toolbar>
					<v-toolbar-title>Version 0.4.0</v-toolbar-title>

					<v-spacer></v-spacer>

					<v-toolbar-items>
						<v-btn icon dark @click="isChangelogModal = false">
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar-items>
				</v-toolbar>

				<ul class="pa-4">
					<li class="pb-2">Subscribers now receive their bonus currency for watching.</li>
					<li class="pb-2">Added option to change the volume of alerts.</li>
					<li class="pb-2">Fixed an issue showing duplicated users in the leaderboard.</li>
					<li class="pb-2">Added various UI/UX improvements and bug fixes.</li>
				</ul>
			</v-card>
		</v-dialog>
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
				hasNewVersion: !localStorage.getItem('loyal-live-version040'),
				isChangelogModal: false,
				reFetchInterval: 30 // seconds
			}
		},
		watch: {
			hasNewVersion (val) {
				if (!val) {
					localStorage.setItem('loyal-live-version040', true)
				}
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
					console.log(res.data)
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
