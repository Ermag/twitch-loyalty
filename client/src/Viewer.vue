<template>
	<v-app dark>
		<div class="app-visible" :class="{ hide: !isVisible }" @mouseleave="mouseLeave" @mousemove="mouseMove">
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

							<div class="alt-tabs-wrapper">
								<ul class="alt-tabs">
									<li class="pointer" v-for="ltab in tabs" :key="ltab" :class="[ltab.toLowerCase(), {  active: tab === ltab }]" @click="changeTab(ltab)" >
										<v-tooltip top>
											<div slot="activator"></div>
											<span>{{ ltab }}</span>
										</v-tooltip>
									</li>
									<li class="inactive"></li>
								</ul>

								<div class="alt-tab-content" v-bar>
									<div>
										<transition name="fade" mode="out-in">
											<Profile v-if="tab === 'Profile'" :user="user" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
											<Shop v-if="tab === 'Rewards'" :user="user" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
											<Battle v-if="tab === 'Battle'" :user="user" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
											<Leaderboard v-if="tab === 'Leaderboard'" :user="user" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
										</transition>
									</div>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</v-app>
</template>

<style lang="scss">
	@import './styles/_vars';
	@import './styles/main';

	.app-visible {
		width: 100%;
		height: 100%;
		opacity: 1;
		transition: .5s opacity;

		&.hide {
			opacity: 0;
		}
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
			position: relative;
				z-index: 9999;
			width: 100%;
			height: 100%;

			.alt-tabs-wrapper {
				height: calc(100% - 95px);
				margin-top: 15px;
				padding: 2px;
				overflow: hidden;
				background: url('./assets/tabs-wrapper-bg.jpg') no-repeat center center;
			}

			.alt-tab-content {
				position: relative;
				height: calc(100% - 40px);
				padding-top: 10px;
				overflow: auto;
			}

			.alt-tabs {
				height: 40px;
				padding: 0;
				margin: 0;
				list-style-type: none;
				li {
					width: 54px;
					height: 100%;
					float: left;
					margin-right: 2px;
					background: $secondary url('./assets/tabs-icons.png') no-repeat 0 0;
					border-top-left-radius: 2px;
					border-top-right-radius: 2px;
					&.profile {
						background-position: 0 0;
						&.active {
							background-position: -0 -40px;
						}
					}
					&.rewards {
						background-position: -54px 0;
						&.active {
							background-position: -54px -40px;
						}
					}
					&.battle {
						background-position: -108px 0;
						&.active {
							background-position: -108px -40px;
						}
					}
					&.leaderboard {
						background-position: -162px 0;
						&.active {
							background-position: -162px -40px;
						}
					}
					&.active {
						background-color: transparent;
					}
					&.inactive {
						width: 58px;
						margin-right: 0;
						background-position: -9999px;
					}
					& div {
						height: 100%;
					}
				}
			}
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
	import { EventBus } from './utils/event-bus'
	import Info from './components/Info'
	import Profile from './components/Profile'
	import Shop from './components/Shop'
	import Battle from './components/Battle'
	import Leaderboard from './components/Leaderboard'

	export default {
		name: 'Viewer',
		components: {
			Info,
			Profile,
			Shop,
			Battle,
			Leaderboard
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
				user: null,
				counterInterval: null,
				tabs: ['Profile', 'Rewards', 'Battle', 'Leaderboard'],
				tab: 'Profile',
				hasNotification: false
			}
		},
		methods: {
			mouseMove (event) {
				if (!this.hasToggle) {
					return
				}

				clearTimeout(this.visibleTimeout)

				if (!this.isVisible) {
					this.isVisible = true
				}
			},
			mouseLeave () {
				if (!this.hasToggle) {
					return
				}

				clearTimeout(this.visibleTimeout)
				this.visibleTimeout = setTimeout(() => {
					if (this.isVisible) {
						this.isVisible = false
					}
				}, 3000)
			},
			changeTab (tab) {
				this.tab = tab
			},
			fetchUser (data) {
				this.axios.post(`${process.env.VUE_APP_API}user`, data).then(res => {
					this.user = res.data

					if (this.user.channel.pointsName) {
						this.POINTS_NAME = this.user.channel.pointsName
					}

					if (this.user.channel.pointsImg) {
						this.POINTS_IMG = this.user.channel.pointsImg
					}

					this.startCounter()
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
			},
			startCounter () {
				this.counterInterval = setInterval(() => {
					this.axios.get(`${process.env.VUE_APP_API}user?id=${this.user._id}`).then(res => {
						if (!res.data) {
							return
						}

						this.user = res.data

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
			EventBus.$on('claimedReward', reward => {
				this.user.currentPoints -= reward.points
				this.user.experience += reward.experience
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

			this.hasToggle = params.get('anchor') !== 'panel'
			if (!this.hasToggle) {
				this.isPanelActive = true
			}

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
						this.hasMessage = true
						this.message = 'Login on Twitch to see your<br />awesome profile!'
						this.isLoading = false
						return
					}

					if (userId) {
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
								isFollowing: follow.status !== 404
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
				this.hasError = true
				this.isLoading = false
			}
		},
		beforeDestroy () {
			clearInterval(this.counterInterval)
		}
	}
</script>
