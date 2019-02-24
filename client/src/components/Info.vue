<template>
	<div class="info-wrapper">
		<img :src="user.avatar" :alt="user.displayName" />

		<div class="info-stats">
			<div class="username">
				<v-tooltip bottom>
					<h1 slot="activator">{{ user.displayName }}</h1>
					<span style="white-space: nowrap;">{{ user.displayName }}</span>
				</v-tooltip>
			</div>

			<div class="metrics" slot="activator">
				<div class="points">
					<Points :value="-1" :name="POINTS_NAME" :img="POINTS_IMG" :size="24" pos="bottom" /> <i class="primary--text">{{ formatQuantity(user.currentPoints) }}</i>
				</div>
				<v-tooltip bottom>
					<div class="watch-time" slot="activator">{{ Math.floor(user.watchTime / 60) + '.' + user.watchTime % 60 }}h</div>
					<span>Watch Time</span>
				</v-tooltip>
			</div>

			<div class="level">
				<v-tooltip bottom>
					<div class="progress" slot="activator" :style="{ width: expProgress.toFixed(2) + '%' }"></div>
					<span>Experience: {{ user.experience }}/{{ expNextLevel }}</span>
				</v-tooltip>
				<div class="lvl-divider first"></div>
				<div class="lvl-divider second"></div>
				<div class="lvl-divider third"></div>
				<div class="value"><span>{{ user.level }}</span></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '../styles/_vars';

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
					background: linear-gradient(130deg, #eed773, #ef9b72, #efd973);
					background-size: 600% 600%;
					animation: Exp 30s ease-in-out infinite;
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
						z-index: 1;
						bottom: -7px;
					width: 100%;
					height: 8px;
					line-height: 8px;
					text-align: center;
					span {
						display: inline-block;
						height: 100%;
						padding: 0 5px;
						font-weight: bold;
						font-family: 'Trebuchet MS', sans-serif;
						background: rgba(23, 21, 26, .5);
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
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
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

				i {
					font-style: normal;
					margin-left: 5px;
					font-size: 24px;
				}
			}

			.watch-time {
				margin-top: 7px;
				color: #898989;
				font-size: 18px;
			}
		}
	}
</style>

<script>
	import Points from './Points'
	import { helpers } from '../utils/helpers'

	export default {
		name: 'Info',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points
		},
		data () {
			return {
				expProgress: 0,
				expNextLevel: 0
			}
		},
		methods: {
			formatQuantity: helpers.formatQuantity
		},
		created () {
			this.expNextLevel = Math.round(175 * Math.pow(this.user.level + 1, 1.5))
			this.expProgress = (300 / this.expNextLevel) * 100
		}
	}
</script>
