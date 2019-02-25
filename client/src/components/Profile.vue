<template>
	<transition name="fade" mode="out-in">
		<div v-if="isLoading" class="text-xs-center alt-loading">
			<v-progress-circular :size="64" :width="7" color="primary" indeterminate></v-progress-circular>
		</div>
		<div v-else-if="hasError" class="my-2 mx-3 text-xs-center">
			<v-alert :value="true" color="error">
				<h3>Something went wrong :(<br>Please, try again later!</h3>
			</v-alert>
		</div>
		<div v-else-if="hasInitialReward">
			<h1 class="text-xs-center mb-3">Welcome!</h1>

			<div class="text-xs-center">
				<div class="mb-2">
					<Points :value="-1" :name="POINTS_NAME" :img="POINTS_IMG" :size="20" />
					<span class="primary--text ml-1 title" style="vertical-align: middle;">{{ initialPoints }}</span>
				</div>
				<v-btn class="title" color="primary" @click="claimInitial" small>Claim</v-btn>
			</div>
		</div>
		<div v-else>
			Quests/Achievemnts
		</div>
	</transition>
</template>

<style lang="scss" scoped>
	.alt-loading {
		margin-left: -32px;
	}
</style>

<script>
	import { APP_CONFIG } from '../utils/constants'
	import { EventBus } from '../utils/event-bus'
	import Points from './Points'

	export default {
		name: 'Profile',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
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
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
			}
		},
		created () {
			// Check is the initial reward claimed
			this.axios.get(`${process.env.VUE_APP_API}claim?cid=${this.user.channel._id}&uid=${this.user._id}&rid=${this.initialRewardId}`).then(res => {
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
