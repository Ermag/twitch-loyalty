<template>
	<v-app dark>
		<div class="alt-wrapper" :class="{ offset: hasToggle, fullscreen: isFullScreen }">
			<div class="alt-toggle pointer" v-if="hasToggle" @click="isPanelActive = !isPanelActive">
				<div></div>
			</div>

			<transition name="fade" mode="out-in">
				<div class="alt-panel" v-if="isPanelActive">
					<div v-if="isLoading" class="text-xs-center alt-loading">
						<v-progress-circular :size="100" :width="7" color="primary" indeterminate></v-progress-circular>
					</div>
					<div v-else-if="!isLoggedIn" class="my-2 mx-3 text-xs-center">
						<v-alert :value="true" color="#513c80">
							<h3>Login on Twitch to see your<br />awesome profile!</h3>
						</v-alert>
						<img src="./assets/mascot.png" class="mt-5" style="max-width: 100%;" />
					</div>
					<div v-else-if="hasError" class="my-2 mx-3 text-xs-center">
						<v-alert :value="true" color="error">
							<h3>Something went wrong :(<br>Please, try again later!</h3>
						</v-alert>
					</div>
					<div v-else class="alt-content">
						<Info :user="user" />
					</div>
				</div>
			</transition>
		</div>
	</v-app>
</template>

<style lang="scss">
	@import './styles/_vars';
	@import './styles/main';

	.alt-toggle {
		position: relative;
		float: left;
		width: 35px;
		height: 35px;
		margin-right: 16px;
		border-radius: 2px;
		box-shadow: 3px 3px 0 0 rgba(0, 0, 0, .45);
		> div {
			position: absolute;
				top: 0;
				left: 0;
			width: 100%;
			height: 100%;
			border: 2px solid $primary;
			border-radius: 2px;
			box-sizing: border-box;
			background: $secondary;
			transition: all .2s;
		}
		&:active {
			& > div {
				top: 3px;
				left: 3px;
			}
		}
	}
	.alt-panel {
		position: relative;
		float: left;
		width: 100%;
		max-width: 318px;
		height: 100%;
		max-height: 496px;
		padding: 12px;
		border: 4px solid $primary;
		box-sizing: border-box;
		background: $secondary;
		box-shadow: 10px 10px 0 0 rgba(0, 0, 0, .45);
		&::before {
			content: '';
			position: absolute;
				top: -4px;
				left: -4px;
				z-index: 999;
			width: calc(100% + 8px);
			height: calc(100% + 8px);
			background: url('./assets/bg-overlay.png') no-repeat 0 0;
			pointer-events: none;
		}
		.alt-content {
			width: 100%;
			height: 100%;
		}
		.alt-loading {
			position: absolute;
				top: 50%;
				left: 50%;
				z-index: 99;
			margin: -50px 0 0 -50px;
		}
	}
</style>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'
	import Info from './components/Info'

	export default {
		name: 'Viewer',
		components: {
			Info
		},
		data () {
			return {
				...APP_CONFIG,
				isPanelActive: true,
				isLoading: true,
				hasError: false,
				isLoggedIn: true,
				hasToggle: true,
				isFullScreen: true,
				user: null
			}
		},
		methods: {
			fetchUser () {
				// this.axios.get(`${process.env.VUE_APP_API}channel?tid=${this.Auth.getChannelId()}`).then(res => {
				// 	this.channel = res.data

				// 	if (this.channel.pointsName) {
				// 		this.POINTS_NAME = this.channel.pointsName
				// 	}

				// 	if (this.channel.pointsImg) {
				// 		this.POINTS_IMG = this.channel.pointsImg
				// 	}

				// 	// TODO: Fetch user now
				// }).catch(() => {
				// 	this.hasError = true
				// }).then(() => {
				// 	this.isLoading = false
				// })
			}
		},
		created () {
			let uri = window.location.search.substring(1)
			let params = new URLSearchParams(uri)

			this.hasToggle = params.get('anchor') !== 'panel'

			this.twitch = window.Twitch ? window.Twitch.ext : null

			if (this.twitch) {
				this.twitch.onContext((context, fields) => {
					if (fields.indexOf('isTheatreMode') !== -1 || fields.indexOf('isFullScreen') !== -1) {
						this.isFullScreen = context.isFullScreen || context.isTheatreMode
					}
				})

				this.twitch.onAuthorized(auth => {
					this.Auth = new Authentication(auth)
					let userId = this.Auth.getUserId()

					if (!this.Auth.isLoggedIn()) {
						this.isLoggedIn = false
						return
					}

					console.log(1, userId)

					if (userId) {
						this.axios.get(`https://api.twitch.tv/kraken/users/${userId}`, {
							headers: {
								'Accept': 'application/vnd.twitchtv.v5+json',
								'Client-ID': 'cx4rlgwlppmertltfy1dql4twr2cw6'
							}
						}).then(res => {
							console.log(res.data)
						})

						this.axios.defaults.headers.common['Content-Type'] = 'application/json'
						this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.Auth.getToken()}`

						this.fetchUser()
					} else {
						this.twitch.actions.requestIdShare()
					}
				})
			} else {
				this.hasError = true
			}
		}
	}
</script>
