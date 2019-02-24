<template>
	<div class="info-wrapper">
		<img :src="user.avatar" :alt="user.displayName" />

		<div class="info-stats">
			<div class="username">
				<v-tooltip bottom>
					<h1 slot="activator" style="margin-top: -5px;">{{ user.displayName }}</h1>
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
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import '../styles/_vars';

	.info-wrapper {
		position: relative;
		width: 100%;
		height: 80px;
		padding-left: 96px;
		box-sizing: border-box;

		img {
			position: absolute;
				left: 0;
			width: 76px;
			height: 76px;
			border: 2px solid $primary;
		}

		.info-stats {
			width: 100%;
			height: 100%;

			.username {
				display: flex;
				width: 100%;
			}

			h1 {
				flex: 1;
				margin: 0;
				color: #FFF;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 30px;
			}

			.metrics {
				display: flex;
				width: 100%;
				height: 30px;
				background: rgba(23, 21, 26, .5);
				padding: 0 3px;
				color: #636363;
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
				color: #636363;
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
			return {}
		},
		methods: {
			formatQuantity: helpers.formatQuantity
		},
		created () {
			console.log(this.user)
		}
	}
</script>
