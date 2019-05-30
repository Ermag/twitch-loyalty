<style lang="scss">
	@import '../../styles/_vars';

	.alt-tabs-wrapper {
		height: calc(100% - 95px);
		margin-top: 15px;
		padding: 2px;
		overflow: hidden;
		background: url('../../assets/tabs-wrapper-bg.jpg') no-repeat center center;

		.alt-tab-content {
			position: relative;
			height: calc(100% - 40px);
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
				background: $secondary url('../../assets/tabs-icons.png') no-repeat 0 0;
				border-top-left-radius: 2px;
				border-top-right-radius: 2px;
				transition: all .5s ease-in-out;

				&:first-child {
					width: 56px;
				}

				&:last-child {
					width: 56px;
					margin-right: 0;
				}

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

				&.shop {
					background-position: -216px 0;
					&.active {
						background-position: -216px -40px;
					}
				}

				&.active {
					background-color: transparent;
				}

				&.inactive {
					background-position: -9999px;
				}

				& div {
					height: 100%;
				}
			}
		}
	}
</style>

<template>
	<div class="alt-tabs-wrapper">
		<ul class="alt-tabs">
			<li class="pointer" v-for="tab in tabs" :key="tab" :class="[tab.toLowerCase(), { active: currentTab === tab }]" @click="changeTab(tab)">
				<v-tooltip top>
					<div slot="activator"></div>
					<span>{{ tab }}</span>
				</v-tooltip>
			</li>
			<li v-if="!hasBits" class="inactive"></li>
		</ul>

		<div class="alt-tab-content" v-bar>
			<div>
				<transition name="fade" mode="out-in">
					<component
						v-bind:is="currentTab"
						:user="user"
						:changeTab="changeTab"
						:POINTS_NAME="POINTS_NAME"
						:POINTS_IMG="POINTS_IMG"></component>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import Profile from './Profile'
	import Rewards from './Shop'
	import Battle from './Battle'
	import Leaderboard from './Leaderboard'
	import Shop from './Store'

	export default {
		name: 'Navigation',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Profile,
			Rewards,
			Battle,
			Leaderboard,
			Shop
		},
		data () {
			return {
				currentTab: 'Profile',
				hasBits: false
			}
		},
		computed: {
			tabs () {
				let list = ['Profile', 'Rewards', 'Battle', 'Leaderboard']

				if (this.hasBits) {
					list.push('Shop')
				}

				return list
			}
		},
		methods: {
			changeTab (tab) {
				this.currentTab = tab
			}
		},
		created () {
			// window.Twitch.ext.features.isBitsEnabled
			this.hasBits = true
		}
	}
</script>
