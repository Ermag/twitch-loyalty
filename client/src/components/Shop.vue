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
		<div v-else class="px-1">
			<div class="reward my-2" v-for="(reward, index) in rewards" :key="reward._id">
				<v-tooltip right>
					<img slot="activator" class="mr-2" :src="baseURL + reward.image" :alt="reward.name" />
					<span>{{ reward.name }}</span>
				</v-tooltip>

				<transition name="fade" mode="out-in">
					<div v-if="reward.confirm" key="confirm">
						<div style="margin: 0px 0 8px 0;">
							<v-text-field
								class="ma-0 pa-0"
								height="26"
								v-model="reward.message"
								:rules="[rules.name]"
								placeholder="Message (optional)" maxlength="100" counter autofocus hide-details></v-text-field>
						</div>
						<v-btn class="ma-0 mr-2" color="success" @click="claim(index, reward)" small outline>Confirm</v-btn>
						<v-btn class="ma-0 mr-2"  color="error" @click="confirm(index, reward, false)" small outline>Cancel</v-btn>
					</div>
					<div v-else key="details">
						<div class="reward-header">
							<span>{{ reward.name }}</span>
						</div>
						<div style="margin-top: 6px;">
							<v-btn class="ma-0 mr-2" color="primary" @click="confirm(index, reward, true)" :disabled="reward.points > user.currentPoints" small outline>Claim</v-btn>
							<Points :value="reward.points" :name="POINTS_NAME" :img="POINTS_IMG" :size="18" :css="reward.points > user.currentPoints ? 'red--text' : ''" />
						</div>
					</div>
				</transition>

				<div class="clearfix"></div>
			</div>
		</div>
	</transition>
</template>

<style lang="scss" scoped>
	@import '../styles/_vars';

	.reward {
		border-bottom: 2px solid $primary;
		font-size: 15px;

		img {
			float: left;
			height: 65px;
			border: 2px solid $primary;
			border-bottom: 0;
			vertical-align: top;
		}
	}

	.reward-header {
		display: flex;

		> span:first-child {
			flex: 1;
			padding-right: 10px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 16px;
			margin-top: -3px;
		}
	}
</style>

<script>
	import { EventBus } from '../utils/event-bus'
	import Points from './Points'

	export default {
		name: 'Shop',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				isLoading: true,
				hasError: false,
				rewards: [],
				baseURL: process.env.VUE_APP_API,
				rules: {
					name: value => (value && value.length <= 100) || 'Max 100 characters'
				}
			}
		},
		methods: {
			claim (index, reward) {
				this.axios.post(`${process.env.VUE_APP_API}claim`, {
					reward: reward._id,
					user: this.user._id,
					channel: this.user.channel._id,
					msg: reward.message
				}).then(res => {
					EventBus.$emit('claimedReward', {
						points: reward.points,
						experience: reward.points
					})
					this.confirm(index, reward, false)
				}).catch(() => {
					this.hasError = true
				})
			},
			confirm (index, reward, val) {
				reward.confirm = val
				reward.message = ''
				this.$set(this.rewards, index, reward)
			}
		},
		created () {
			this.axios.get(`${process.env.VUE_APP_API}reward?cid=${this.user.channel._id}&orderBy=points`).then(res => {
				this.rewards = res.data
				this.rewards.forEach(reward => {
					reward.yes = false
				})
			}).catch(() => {
				this.hasError = true
			}).then(() => {
				this.isLoading = false
			})
		}
	}
</script>
