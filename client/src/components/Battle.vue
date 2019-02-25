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
			<div class="preview mt-4 text-xs-center">
				<div style="margin-right: 30px;">
					<img :src="you.avatar" :alt="user.displayName" />
					<span>{{ user.displayName }}</span>
				</div>
				<img src="../assets/vs.png" alt="Vs" />
				<div style="margin-left: 30px;">
					<img :src="opponent.avatar" :alt="opponent.name" />
					<span>{{ opponent.name }}</span>
				</div>
			</div>
			<div class="clearfix"></div>

			<transition name="fade" mode="out-in">
				<div v-if="!amount" class="text-xs-center mt-5" key="amount">
					<div class="headline mb-3">Choose Amount</div>
					<div v-for="(am, i) in amounts" :key="i" class="amount pointer" :class="{ disabled: am > user.currentPoints }" @click="amount = am">
						<Points :value="am" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" :css="am > user.currentPoints ? 'headline ml-1 red--text' : 'headline ml-1'" />
					</div>
				</div>
				<div v-else-if="result === null" class="text-xs-center mt-5" key="move">
					<div class="headline mb-2">Choose Your Move</div>
					<div v-for="(mv, i) in moves" :key="i" class="move pointer" @click="battle(mv)">
						<img :src="require('../assets/move-' + mv + '.jpg')" />
					</div>
				</div>
				<div v-else class="text-xs-center mt-5" key="result">
					<div v-if="result == 0" class="mb-2">
						<div class="headline error--text mb-1">You Lost, but gained EXP!</div>
						<Points :value="amount" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" :css="'headline ml-1'" />
					</div>
					<div v-else-if="result == 1" class="mb-2">
						<div class="headline success--text mb-1">You Won!</div>
						<Points :value="amount * 2" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" :css="'headline ml-1'" />
					</div>
					<div v-else class="headline mb-3 grey--text">Draw</div>

					<v-btn color="primary" @click="findOpponent" outline>Play Again</v-btn>
				</div>
			</transition>

			<v-snackbar v-model="maximumBattles" color="info" :timeout="4000" top absolute>
				You can play 10 battles per day.
				<v-btn @click="maximumBattles = false" dark flat>Close</v-btn>
			</v-snackbar>
		</div>
	</transition>
</template>

<style lang="scss" scoped>
	@import '../styles/_vars';

	.alt-loading {
		margin-left: -32px;
	}
	.amount {
		display: inline-block;
		margin: 0 10px;
		&.disabled {
			pointer-events: none;
			opacity: .7;
			cursor: default;
		}
	}
	.move {
		display: inline-block;
		width: 76px;
		height: 76px;
		border: 2px solid $primary;
		margin-right: -1px;
		box-sizing: content-box;
	}
	.preview {
		position: relative;

		> img {
			position: absolute;
				top: 15px;
				left: 50%;
			width: 53px;
			height: 62px;
			margin-left: -26px;
		}
		> div {
			float: left;
			width: calc(50% - 30px);

			img {
				height: 76px;
				border: 2px solid $primary;
			}
			span {
				display: block;
				font-size: 16px;
			}
		}
	}
</style>

<script>
	import { EventBus } from '../utils/event-bus'
	import Points from './Points'

	export default {
		name: 'Battle',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				isLoading: true,
				hasError: false,
				baseURL: process.env.VUE_APP_API,
				opponent: {
					id: null,
					name: null,
					avatar: null
				},
				you: {
					avatar: null
				},
				amounts: [10, 20, 50],
				moves: [1, 2, 3],
				amount: null,
				move: null,
				result: null,
				maximumBattles: false
			}
		},
		methods: {
			findOpponent () {
				this.isLoading = true
				this.amount = null
				this.move = null
				this.result = null

				this.you.avatar = this.user.avatar

				this.axios.get(`${process.env.VUE_APP_API}userRand?cid=${this.user.channel._id}`).then(res => {
					// If you found yourself choose the Overseer
					if (res.data._id === this.user._id) {
						this.opponent.name = 'Overseer'
						this.opponent.avatar = require('../assets/overseer.jpg')
					} else {
						this.opponent.id = res.data._id
						this.opponent.name = res.data.displayName
						this.opponent.avatar = res.data.avatar
					}
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
			},
			battle (move) {
				this.axios.post(`${process.env.VUE_APP_API}battle`, {
					user: this.user._id,
					opponent: this.opponent.id,
					points: this.amount,
					userMove: move
				}).then(res => {
					this.result = res.data.result
					this.you.avatar = require(`../assets/move-${move}.jpg`)
					this.opponent.avatar = require(`../assets/move-${res.data.opponentMove}.jpg`)
					let points = 0

					if (this.result === 0) {
						points = this.amount // Lost
					} else if (this.result === 1) {
						points = this.amount * -2 // Won
					}

					EventBus.$emit('claimedReward', {
						points: points,
						experience: this.result === 0 ? points : 0
					})
				}).catch(err => {
					if (err.response.status === 422) {
						this.maximumBattles = true
						this.amount = null
						this.move = null
						this.result = null
					} else {
						this.hasError = true
					}
				}).then(() => {
					this.isLoading = false
				})
			}
		},
		created () {
			this.findOpponent()
		}
	}
</script>
