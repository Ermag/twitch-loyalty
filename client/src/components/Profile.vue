<template>
	<transition name="fade" mode="out-in">
		<div v-if="isLoading" class="text-xs-center alt-loading" style="margin: -32px 0 0 -32px;">
			<v-progress-circular :size="64" :width="7" color="primary" indeterminate></v-progress-circular>
		</div>
		<div v-else-if="hasError" class="my-3 mx-3 text-xs-center">
			<v-alert :value="true" color="error">
				<h3>Something went wrong :(<br>Please, try again later!</h3>
			</v-alert>
		</div>
		<div class="welcome" v-else-if="hasInitialReward">
			<img src="../assets/welcome.png" width="286" height="141" alt="Hello there!" />
			<h2 class="text-xs-center mb-1 px-2">Welcome to your Alter profile!</h2>
			<p class="text-xs-center mb-3 subheading px-2" style="line-height: normal;">
				By watching this channel you obtain <Points :value="-1" :name="POINTS_NAME" :img="POINTS_IMG" :size="16" /><span class="primary--text">{{ POINTS_NAME }}</span>
				which you can spend on cool <a @click="changeTab('Rewards')">rewards</a> or <a @click="changeTab('Battle')">battle</a> other viewers.
				Claim your welcome gift below!
			</p>

			<div class="text-xs-center">
				<Points :value="initialPoints" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" css="mx-1 title" />
				<v-btn class="title" color="primary" @click="claimInitial" small outline>Claim</v-btn>
			</div>
		</div>
		<div class="quests" v-else>
			<div class="quests-bg"></div>
			<div class="quests-tba text-xs-center headline">Coming Soon</div>
		</div>
	</transition>
</template>

<style lang="scss" scoped>
	.alt-loading {
		margin-left: -32px;
	}

	.welcome {
		padding-top: 141px;
		box-sizing: border-box;
		img {
			position: absolute;
				top: 0;
				left: 0;
		}
	}

	.welcome,
	.quests,
	.quests-bg {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.quests-bg {
		background: url('../assets/profile-bg.png') no-repeat center center;
		opacity: .4;
	}
	.quests-tba {
		position: absolute;
			top: 50%;
			left: 0;
		width: 100%;
		margin-top: -16px;
		text-shadow: 1px 1px 2px #000;
	}
</style>

<script>
	import { APP_CONFIG } from '../utils/constants'
	import { EventBus } from '../utils/event-bus'
	import Points from './Points'

	export default {
		name: 'Profile',
		props: ['user', 'changeTab', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				isLoading: true,
				hasError: false,
				initialRewardId: '5c6cc5f677ef5c47b4d87bb0',
				hasInitialReward: false,
				baseURL: process.env.VUE_APP_API,
				initialPoints: APP_CONFIG.STARTING_POINTS
			}
		},
		methods: {
			claimInitial () {
				this.isLoading = true

				this.axios.post(`${process.env.VUE_APP_API}claim`, {
					reward: this.initialRewardId,
					user: this.user._id,
					channel: this.user.channel._id
				}).then(res => {
					EventBus.$emit('claimedReward', {
						points: this.initialPoints * -1,
						experience: 0
					})
					this.hasInitialReward = false
					EventBus.$emit('stopNotification')
					this.changeTab('Rewards')
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
			}
		},
		created () {
			// Check is the initial reward claimed
			this.axios.get(`${process.env.VUE_APP_API}claim?cid=${this.$props.user.channel._id}&uid=${this.$props.user._id}&rid=${this.initialRewardId}`).then(res => {
				if (!res.data.length) {
					this.hasInitialReward = true
				} else {
					EventBus.$emit('stopNotification')
				}
			}).catch(() => {
				this.hasError = true
			}).then(() => {
				this.isLoading = false
			})
		}
	}
</script>
