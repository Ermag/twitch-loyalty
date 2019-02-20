<template>
	<div class="info-wrapper">
		<img :src="avatar" />

		<div class="info-stats">
			<div class="username">
				<v-tooltip bottom>
					<template #activator="data">
						<h1 v-on="data.on">{{ username }}</h1>
					</template>
					<span style="font-size: 15px; white-space: nowrap;">{{ this.username }}</span>
				</v-tooltip>
			</div>

			<div class="metrics">

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
				width: 100%;
				height: 28px;
				background: #18161A;
				font-size: 18px;
				color: #636363;
			}
		}
	}
</style>

<script>
	import Points from './Points'

	export default {
		name: 'Info',
		props: ['user'],
		components: {
			Points
		},
		data () {
			return {
				username: 'Born2Phil',
				avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/52849e71-5946-4521-9981-faa98ba21349-profile_image-300x300.jpeg'
			}
		}
	}
</script>
