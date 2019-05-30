<style lang="scss" scoped>
	@import '../../styles/_vars';

	@keyframes Exp {
		0% { background-position: 0% 5%; }
		50% { background-position: 100% 96%; }
		100% { background-position: 0% 5%; }
	}

	.info-wrapper {
		position: relative;
		width: 100%;
		height: 80px;
		padding-left: 96px;
		box-sizing: border-box;

		img {
			position: absolute;
				left: 0;
			width: 80px;
			height: 80px;
			border: 2px solid $primary;
		}

		.info-stats {
			width: 100%;
			height: 100%;

			.level {
				position: relative;
				height: 12px;
				margin-top: 4px;
				padding: 2px;
				background: rgba(23, 21, 26, .5);
				.progress {
					position: relative;
						z-index: 2;
					height: 100%;
					background: linear-gradient(130deg, #EED773, #EF9B72, #EFD973);
					background-size: 600% 600%;
					animation: Exp 30s ease-in-out infinite;
					transition: width 1.25s ease-in-out;
				}
				.lvl-divider {
					position: absolute;
						top: 0;
						left: 25%;
						z-index: 3;
					width: 2px;
					height: 100%;
					margin-left: -1px;
					background: rgba(23, 21, 26, .5);
					&.second {
						left: 50%;
					}
					&.third {
						left: 75%;
					}
				}
				.value {
					position: absolute;
						z-index: 4;
						bottom: -7px;
					width: 100%;
					height: 8px;
					line-height: 8px;
					text-align: center;
					span {
						display: inline-block;
						height: 100%;
						padding: 0 6px;
						font-weight: bold;
						font-family: 'Trebuchet MS', sans-serif;
						background: rgba(23, 21, 26, .5);
						border-bottom-left-radius: 2px;
						border-bottom-right-radius: 2px;
					}
				}
			}

			.username {
				display: flex;
				width: 100%;
			}

			h1 {
				flex: 1;
				margin: -7px 0 0 0;
				color: #FFF;
				font-size: 28px;
			}

			.metrics {
				display: flex;
				width: 100%;
				height: 30px;
				margin-top: 7px;
				padding: 0 3px;
				background: rgba(23, 21, 26, .5);
			}

			.points {
				display: flex;
				flex-grow: 1;
				line-height: 30px;
			}

			.watch-time {
				margin-top: 7px;
				color: #898989;
				font-size: 18px;
			}
		}
	}
</style>

<template>
	<div class="info-wrapper">
		<img :src="user.profile.avatar" :alt="user.profile.displayName" width="76" height="76" />

		<div class="info-stats">
			<div class="username">
				<v-tooltip bottom>
					<h1 class="clip-txt" slot="activator">{{ user.profile.displayName }}</h1>
					<span style="white-space: nowrap;">{{ user.profile.displayName }}</span>
				</v-tooltip>
			</div>

			<div class="metrics" slot="activator">
				<div class="points">
					<Points @click.native="isPointsInfo = true" :value="user.currentPoints" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" pos="bottom" :css="'pointer large-points'" />
				</div>
				<v-tooltip bottom>
					<div class="watch-time" slot="activator">{{ Math.floor(user.watchTime / 60) + '.' + user.watchTime % 60 }}h</div>
					<span>Watch Time</span>
				</v-tooltip>
			</div>

			<v-tooltip bottom>
				<div class="level" slot="activator">
					<div class="progress" :style="{ width: expProgress.toFixed(2) + '%' }"></div>
					<div class="lvl-divider first"></div>
					<div class="lvl-divider second"></div>
					<div class="lvl-divider third"></div>
					<div class="value"><span>{{ user.profile.level }}</span></div>
				</div>
				<div class="text-xs-center">
					Level: {{ user.profile.level }}<br />
					Experience: {{ user.profile.experience }}/{{ expNextLevel }}
				</div>
			</v-tooltip>
		</div>

		<v-dialog v-model="isPointsInfo" content-class="ma-3" attach="#app .alt-panel" full-width>
			<v-card>
				<v-card-title class="title pb-0 pr-0">
					{{ POINTS_NAME }} Info
				</v-card-title>

				<v-card-text class="subheading">
					By watching the channel you obtain <Points :value="-1" :name="POINTS_NAME" :img="POINTS_IMG" :size="16" /><span class="primary--text">{{ POINTS_NAME }}</span>
					which you can spend on rewards or battle other viewers. You gain <Points :value="1" :name="POINTS_NAME" :img="POINTS_IMG" :size="16" css="mr-1" /> for every minute you watch.
					Followers and subscribers receive a multiplier bonus x2/x4 respectively.
				</v-card-text>

				<v-card-actions >
					<v-spacer></v-spacer>

					<v-btn @click="isPointsInfo = false" small outline>Ok</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import { EventBus } from '../../utils/event-bus'
	import { helpers } from '../../utils/helpers'
	import Points from '../Points'

	export default {
		name: 'Info',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				expProgress: 0,
				expNextLevel: 0,
				isPointsInfo: false
			}
		},
		methods: {
			formatQuantity: helpers.formatQuantity,
			calcExp () {
				let prev = 0

				this.expNextLevel = Math.round(175 * Math.pow(this.user.profile.level + 1, 1.5))

				if (this.user.profile.level > 1) {
					prev = Math.round(175 * Math.pow(this.user.profile.level - 1 + 1, 1.5))
				}

				this.expProgress = Math.min(100, ((this.user.profile.experience - prev) / (this.expNextLevel - prev)) * 100)
			}
		},
		updated () {
			this.calcExp()

			if (this.user.profile.experience >= this.expNextLevel) {
				EventBus.$emit('levelUp', 1)
				this.calcExp()
			}
		},
		created () {
			this.calcExp()

			EventBus.$on('openPointsInfo', () => {
				this.isPointsInfo = true
			})
		}
	}
</script>
