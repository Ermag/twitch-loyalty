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
		<div v-else class="px-1" style="padding-top: 10px;">
			<div class="reward my-2" v-for="(reward, index) in rewards" :key="reward._id">
				<v-tooltip right>
					<div class="image mr-2" slot="activator" @click="showReward(index)" :style="{ 'background-image': 'url(' + baseURL + reward.image + ')' }"></div>
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
						<v-btn class="ma-0 mr-2"  color="error" @click="confirm(index, false)" small outline>Cancel</v-btn>
					</div>
					<div v-else key="details">
						<div class="reward-header">
							<span>{{ reward.name }}</span>
						</div>
						<div style="margin-top: 6px;">
							<v-btn class="ma-0 mr-2" color="primary" @click="confirm(index, true)" :disabled="reward.points > user.currentPoints" small outline>Claim</v-btn>
							<Points :value="reward.points" :name="POINTS_NAME" :img="POINTS_IMG" :size="18" :css="reward.points > user.currentPoints ? 'subheading red--text' : 'subheading'" />
						</div>
					</div>
				</transition>

				<div class="clearfix"></div>
			</div>

			<v-dialog v-model="isPreview" content-class="ma-3" attach="#app .alt-panel" full-width>
				<v-card>
					<v-card-title class="title pb-0 pr-0" style="position: relative;">
						<span style="padding-right: 40px;">{{ rewards[previewReward].name }}</span>
						<v-btn @click="playSound(rewards[previewReward].sound)" style="position: absolute; right: 0;" flat icon>
							<v-icon>volume_up</v-icon>
						</v-btn>
					</v-card-title>

					<v-card-text>
						<div class="text-xs-center"><img :src="baseURL + (rewards[previewReward].image || 'default.png')" height="100" /></div>
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>

						<Points :value="rewards[previewReward].points" :name="POINTS_NAME" :img="POINTS_IMG" :size="18" :css="rewards[previewReward].points > user.currentPoints ? 'subheading red--text' : 'subheading'" />
						<v-btn color="primary" class="ml-2" @click="confirm(previewReward, true); isPreview = false" :disabled="rewards[previewReward].points > user.currentPoints" small outline>Claim</v-btn>
						<v-btn @click="isPreview = false" small outline>Cancel</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
	</transition>
</template>

<style lang="scss" scoped>
	@import '../styles/_vars';

	.alt-loading {
		margin-left: -32px;
	}

	.v-dialog__content {
		position: absolute;
	}

	.reward {
		border-bottom: 2px solid $primary;
		font-size: 15px;

		.image {
			float: left;
			width: 67px;
			height: 65px;
			border: 2px solid $primary;
			border-bottom: 0;
			vertical-align: top;
			background: url('../assets/no-image.jpg') no-repeat center;
			background-size: contain;
			cursor: pointer;
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
				isPreview: false,
				previewReward: 0,
				rewards: [],
				baseURL: process.env.VUE_APP_API,
				rules: {
					name: value => (value && value.length <= 100) || 'Max 100 characters'
				}
			}
		},
		methods: {
			playSound (sound) {
				let audio = new Audio(this.baseURL + (sound || 'default.wav'))
				audio.autoplay = true
				audio.volume = 0.25
			},
			showReward (index) {
				this.isPreview = true
				this.previewReward = index
			},
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
					this.confirm(index, false)
				}).catch(() => {
					this.hasError = true
				})
			},
			confirm (index, val) {
				let reward = this.rewards[index]

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
