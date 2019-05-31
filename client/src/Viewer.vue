<style lang="scss">
	@import './styles/_vars';
	@import './styles/main';

	#app {
		opacity: 1;
		transition: .5s opacity;

		&.hide {
			opacity: 0;
		}
	}

	.v-dialog__content {
		position: absolute;
			z-index: 10001 !important;
	}

	.app-visible {
		width: 100%;
		height: 100%;
	}

	.alt-toggle {
		position: relative;
		float: left;
		width: 42px;
		height: 42px;
		margin: 0 16px 16px 0;
		border-radius: 2px;
		box-shadow: 3px 3px 0 0 rgba(0, 0, 0, .45);
		text-align: center;
		img {
			margin-top: 4px;
			pointer-events: none;
		}
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
			transition: all .15s;
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
		width: 318px;
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
			position: relative;
				z-index: 9999;
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

		.leaderboard .controls .v-menu__content {
			left: 8px !important;
		}
	}
</style>

<template>
	<v-app :class="{ hide: !isVisible }" dark>
		<div class="app-visible" @mousemove="mouseMove">
			<div class="alt-wrapper" :class="{ offset: hasToggle, fullscreen: isFullScreen }">
				<div class="alt-toggle pointer" v-if="hasToggle" @click="isPanelActive = !isPanelActive">
					<div>
						<transition name="fade" mode="out-in">
							<img v-if="!hasNotification" src="./assets/icon.png" key="icon" />
							<img v-else src="./assets/alert.png" key="alert" />
						</transition>
					</div>
				</div>

				<transition name="fade" mode="out-in">
					<div class="alt-panel" v-if="isPanelActive">
						<div v-if="isLoading" class="text-xs-center alt-loading">
							<v-progress-circular :size="100" :width="7" color="primary" indeterminate></v-progress-circular>
						</div>
						<div v-else-if="hasMessage" class="my-2 mx-3 text-xs-center">
							<v-alert :value="true" color="#513c80">
								<h3 v-html="message"></h3>
							</v-alert>
							<img src="./assets/mascot.png" class="mt-5" style="max-width: 100%;" />
						</div>
						<div v-else-if="hasError" class="my-2 mx-3 text-xs-center">
							<v-alert :value="true" color="error">
								<h3>Something went wrong :(<br>Please, try again later!</h3>
							</v-alert>
						</div>
						<div v-else class="alt-content">
							<Info :user="user" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
							<Navigation :user="user" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
						</div>
					</div>
				</transition>
			</div>
		</div>
	</v-app>
</template>

<script>
	import { APP_CONFIG } from './utils/constants'
	import Authentication from './utils/twitch'
	import { EventBus } from './utils/event-bus'
	import Info from './components/viewer/Info'
	import Navigation from './components/viewer/Navigation'

	export default {
		name: 'Viewer',
		components: {
			Info,
			Navigation
		},
		data () {
			return {
				...APP_CONFIG,
				isVisible: true,
				visibleTimeout: null,
				isPanelActive: false,
				isLoading: true,
				hasError: false,
				hasMessage: false,
				message: '',
				hasToggle: true,
				isFullScreen: false,
				user: {
					currentPoints: 0,
					watchTime: 0,
					channel: {},
					profile: {}
				},
				counterInterval: null,
				accessInterval: null,
				hasNotification: false
			}
		},
		watch: {
			hasError (val) {
				if (val === true) {
					setTimeout(() => {
						if (this.isVisible) {
							EventBus.$emit('app-error')
						}
					}, 5000)
				}
			},
			isPanelActive (val) {
				if (val && this.Auth && !this.Auth.getUserId()) {
					this.twitch.actions.requestIdShare()
				}
			}
		},
		methods: {
			mouseMove (event) {
				if (!this.hasToggle) {
					return
				}

				this.isVisible = true

				clearTimeout(this.visibleTimeout)
				this.visibleTimeout = setTimeout(() => {
					if (this.isVisible) {
						this.isVisible = false
					}
				}, 10000)
			},
			fetchUser (data) {
				this.axios.post(`${process.env.VUE_APP_API}user`, data).then(res => {
					this.user = Object.assign(this.user, res.data)

					if (this.user.channel.pointsName) {
						this.POINTS_NAME = this.user.channel.pointsName
					}

					if (this.user.channel.pointsImg) {
						this.POINTS_IMG = this.user.channel.pointsImg
					}
				}).then(() => {
					if (this.user.channel._id) {
						this.isLoading = false
						this.startCounter()
					} else {
						this.hasError = true
					}
				}).catch(() => {
					this.hasError = true
				})
			},
			startCounter () {
				clearInterval(this.counterInterval)

				this.counterInterval = setInterval(() => {
					this.axios.get(`${process.env.VUE_APP_API}user?id=${this.user._id}`).then(res => {
						this.$set(this.user.profile, 'displayName', res.data.profile.displayName)
						this.$set(this.user.profile, 'avatar', res.data.profile.avatar)
						this.$set(this.user.profile, 'level	', res.data.profile.level)
						this.$set(this.user.profile, 'experience', res.data.profile.experience)
						this.$set(this.user, 'currentPoints', res.data.currentPoints)
						this.$set(this.user, 'watchTime	', res.data.watchTime)

						if (this.user.channel.pointsName) {
							this.POINTS_NAME = this.user.channel.pointsName
						}

						if (this.user.channel.pointsImg) {
							this.POINTS_IMG = this.user.channel.pointsImg
						}
					})
				}, 60000)
			}
		},
		created () {
			EventBus.$off(['claimedReward', 'levelUp', 'stopNotification'])

			EventBus.$on('claimedReward', reward => {
				this.$set(this.user, 'currentPoints', this.user.currentPoints - reward.points)
				this.$set(this.user.profile, 'experience', this.user.profile.experience + reward.experience)
			})

			EventBus.$on('levelUp', reward => {
				this.$set(this.user.profile, 'level', this.user.profile.level + 1)
			})

			EventBus.$on('stopNotification', () => {
				clearInterval(this.notificationInterval)
				this.hasNotification = false
			})

			this.notificationInterval = setInterval(() => {
				this.hasNotification = !this.hasNotification
			}, 4000)

			let uri = window.location.search.substring(1)
			let params = new URLSearchParams(uri)

			this.hasToggle = params.get('legacyComponentDesign') === 'true'

			if (!this.hasToggle) {
				this.isPanelActive = true
			}

			this.twitch = window.Twitch ? window.Twitch.ext : null

			if (this.twitch) {
				this.accessInterval = setInterval(() => {
					if (!this.hasToggle && this.Auth && !this.Auth.getUserId()) {
						this.twitch.actions.requestIdShare()
					}
				}, 3000)

				this.twitch.onContext((context, fields) => {
					if (fields.indexOf('isTheatreMode') !== -1 || fields.indexOf('isFullScreen') !== -1) {
						this.isFullScreen = context.isFullScreen || context.isTheatreMode
					}
				})

				this.twitch.onAuthorized(auth => {
					if (this.Auth) {
						return
					}
					this.Auth = new Authentication(auth)
					let userId = this.Auth.getUserId()

					if (!this.Auth.isLoggedIn()) {
						this.hasMessage = true
						this.message = 'Sign in to see your awesome<br />profile and claim rewards!'
						this.isLoading = false
						return
					}

					if (userId) {
						clearInterval(this.accessInterval)
						this.isLoading = true
						this.hasMessage = false

						const twitchHeaders = {
							'Accept': 'application/vnd.twitchtv.v5+json',
							'Client-ID': auth.clientId
						}

						this.axios.defaults.headers.common['Content-Type'] = 'application/json'
						this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.Auth.getToken()}`

						let user = this.axios.get(`${APP_CONFIG.TWITCH_API}users/${userId}`, {
							headers: twitchHeaders
						})

						let follow = this.axios.get(`${APP_CONFIG.TWITCH_API}users/${userId}/follows/channels/${auth.channelId}`, {
							headers: twitchHeaders,
							validateStatus: (status) => {
								return status < 500
							}
						})

						this.axios.all([user, follow]).then(this.axios.spread((user, follow) => {
							this.fetchUser({
								tid: auth.channelId,
								userId: userId,
								displayName: user.data.display_name,
								username: user.data.name,
								avatar: user.data.logo,
								updatedAt: user.data.updated_at,
								isFollowing: follow.status !== 404,
								isSubscriber: !!this.twitch.viewer.subscriptionStatus
							})
						}))
					} else {
						this.hasMessage = true
						this.message = 'Please, give Alter access to see<br />your awesome profile!'
						this.isLoading = false
						this.twitch.actions.requestIdShare()
					}
				})
			} else {
				this.isLoading = false
				window.location.reload()
			}
		},
		beforeDestroy () {
			clearInterval(this.accessInterval)
			clearInterval(this.counterInterval)
		}
	}
</script>
