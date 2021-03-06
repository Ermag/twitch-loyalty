<template>
	<div v-if="isLoading" class="text-xs-center alt-loading" style="margin: -32px 0 0 -32px;">
		<v-progress-circular :size="64" :width="7" color="primary" indeterminate></v-progress-circular>
	</div>
	<div v-else-if="hasError" class="my-3 mx-3 text-xs-center">
		<v-alert :value="true" color="error">
			<h3>Something went wrong :(<br>Please, try again later!</h3>
		</v-alert>
	</div>
	<div class="leaderboard" v-else>
		<v-alert class="my-2 mx-3" :value="users.length === 0" color="info" icon="info">
			<h3>Leader board is empty.</h3>
		</v-alert>

		<div class="controls">
			<v-select class="my-0 mx-2 pa-0" height="30"
				v-model="sort"
				:items="sorts"
				@change="sortChange"
				style="font-size: 18px;"
				attach="#app .app-visible .leaderboard .controls"
				hide-details></v-select>
		</div>

		<div class="results" v-bar>
			<div class="pa-2">
				<table>
					<tbody>
						<tr v-for="(value, index) in users" :key="index" :class="{ top: index < 3, you: index + 1 === position }">
							<td class="text-xs-right" width="28">{{ index + 1 }}.</td>
							<td>
								<div>
									<span></span>
									<img width="26" height="26" :src="value.profile.avatar" />
									<span class="name clip-txt">{{ value.profile.displayName }}</span>
								</div>
							</td>
							<td class="pr-3 text-xs-right primary--text" width="70">
								<span v-if="sortIndex == 0">{{ formatQuantity(value.points) }}</span>
								<span v-else-if="sortIndex == 1">{{ formatQuantity(value.claimedCount) }}</span>
								<span v-else-if="sortIndex == 2">{{ formatQuantity(value.profile.experience) }}</span>
								<span v-else>{{ formatQuantity(value.battlesWon) }}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="position">Your Rank: <span class="primary--text">#{{ position }}</span></div>
	</div>
</template>

<style lang="scss" scoped>
	@import '../../styles/_vars';

	.leaderboard {
		height: 100%;
		min-height: 100%;
		padding-top: 10px;
		box-sizing: border-box;

		& .controls {
			position: relative;
		}
	}
	.position {
		position: absolute;
			left: 0;
			bottom: 0;
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 24px;
		background: $secondary;
		border-radius: 2px;
		text-align: center;
	}

	.results {
		height: calc(100% - 60px);

		table {
			width: 100%;
			border-collapse: collapse;
		}

		tr:hover,
		tr.you {
			background: rgba(255, 255, 255, .12);
		}

		tr.top {
			td {
				line-height: 37px;
				font-size: 22px;
			}
			div {
				padding-left: 30px;

				img {
					display: block;
				}
				span:first-child {
					display: block;
				}
			}

			.name {
				width: 128px;
			}
		}

		tr:last-child td {
			border-bottom: 0;
		}

		tr.top:nth-child(2) div span:first-child {
			background: linear-gradient(to right, rgba(132, 136, 145, 1) 0%, rgba(255, 255, 255, 0) 100%);
		}
		tr.top:nth-child(3) div span:first-child {
			background: linear-gradient(to right, rgba(120, 91, 72, 1) 0%, rgba(255, 255, 255, 0) 100%);
		}

		td {
			padding: 0px 5px;
			border-bottom: 1px solid #b9b9b9;
			font-size: 18px;

			div {
				position: relative;
				img {
					display: none;
					position: absolute;
						z-index: 2;
						left: -5px;
						top: 3px;
					width: 30px;
					height: 30px;
					border: 2px solid $primary;
				}
				span:first-child {
					display: none;
					position: absolute;
						top: 6px;
						left: -2px;
						z-index: 1;
					width: 100%;
					height: 24px;
					background: linear-gradient(to right, rgba(166,146,94,1) 0%, rgba(255,255,255,0) 100%);
				}

				.name {
					display: block;
					position: relative;
						z-index: 2;
					width: 158px;
				}
			}
		}
	}
</style>

<script>
	import { helpers } from '../../utils/helpers'

	export default {
		name: 'Leaderboard',
		props: ['user', 'POINTS_NAME', 'POINTS_IMG'],
		data () {
			return {
				isLoading: true,
				hasError: false,
				sort: this.$props.POINTS_NAME,
				sorts: [this.$props.POINTS_NAME, 'Claimed Rewards', 'Experience', 'Battles Won'],
				sortIndex: 0,
				users: [],
				position: 'n/a',
				baseURL: process.env.VUE_APP_API
			}
		},
		methods: {
			formatQuantity: helpers.formatQuantity,
			getUsers () {
				this.isLoading = true

				this.axios.get(`${process.env.VUE_APP_API}users?cid=${this.user.channel._id}&uid=${this.user._id}&sort=${this.sortIndex}`).then(res => {
					this.users = res.data.users
					this.position = res.data.pos
				}).catch(() => {
					this.hasError = true
				}).then(() => {
					this.isLoading = false
				})
			},
			sortChange () {
				this.sortIndex = this.sorts.indexOf(this.sort)
				this.getUsers()
			}
		},
		created () {
			this.sortIndex = this.sorts.indexOf(this.sort)

			this.getUsers()
		}
	}
</script>
