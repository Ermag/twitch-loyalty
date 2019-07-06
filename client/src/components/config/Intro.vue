<style lang="scss" scoped>
	img {
		float: left;
		margin-right: 5%;
	}

	.desc {
		float: left;
		width: 65%;
		line-height: 1.1;
	}

	.layout {
		border: 1px solid #E5C572;
		border-radius: 2px;
	}
</style>

<style lang="scss">
	.intro-dialog input.copy-url {
		width: 100%;
		margin: 5px 0 0 0;
		padding: 5px;
	}
	.intro-dialog button.v-btn {
		font-size: 18px;
	}
</style>

<template>
	<v-dialog v-model="status" fullscreen persistent>
		<v-card class="intro-dialog">
			<v-toolbar>
				<v-toolbar-title>{{ title }}</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-toolbar-items>
					<v-btn color="primary" @click="nextIntroStep" flat>
						<span class="title">{{ action }}</span>
						<v-icon right dark>arrow_forward</v-icon>
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>

			<div class="title pa-5">
				<v-layout class="pa-3 py-5">
					<v-flex sm12 md10 offset-md1>
						<div v-if="step === 1">
							<img src="../../assets/hello.png" width="30%" alt="Hello!" />
							<div class="desc pt-3">
								This is an introduction guide to help you get started.
								{{ NAME }} is designed to expand your viewership, engage your audience and be another source of income for you!
								By watching your channel, viewers will earn loyalty points every minute (followers and subscribers receive more).
								Loyalty points can be used by your viewers to claim rewards, play sounds, show memes on stream or climb the ladder.
								Also loyalty points can be purchased with bits, for which you receive 80% of the revenue.
								Click 'Next' to continue...
							</div>
						</div>
						<div v-else-if="step === 2">
							<img src="../../assets/customize.png" width="30%" alt="Customize" />
							<div class="desc pt-3">
								You can customize virtually every part of Alter to make it unique to your personal and viewer’s experience!
								The first step is to set-up the live alerts for claiming rewards, so they can be seen by everyone on stream.
								To do so, please follow these instructions:

								<AlertsInstructions class="pt-2" :channel="channel" />
							</div>
						</div>
						<div v-else-if="step === 3">
							<img src="../../assets/loyalty.png" width="30%" alt="Customize" />
							<div class="desc pt-3">
								By default loyalty points are called <Points :value="-1" name="Coins" img="coins.png" :size="20" /> <span class="primary--text">Coins</span>, you can edit the name and image to make them unique for your channel!
								You can change them from the options tab at any time if you dont have an idea at the moment.
								Don’t forget that viewers can purchase them with bits to be able to claim more rewards and get higher in the leaderboard.
								<PointsChange class="mt-3" :channel="channel" :POINTS_NAME="POINTS_NAME" :POINTS_IMG="POINTS_IMG" />
							</div>
						</div>
						<div v-else-if="step === 4">
							<img src="../../assets/rewards.png" width="30%" alt="Rewards" />
							<div class="desc pt-3">
								The rewards you decide to use will be the main source of viewer engagement and extra revenue for your channel.
								We’ve hooked you up with our basic reward templates to get you started. You can customize them or add your own!
								Some rewards can be used to relate to your in-game content, or just memes your audience likes.
								Others can be designed to engage you with challenges on camera. You can change the sound, image and cost of each reward.
								This is where your creativity can truly shine!
							</div>
						</div>
						<div v-else-if="step ===5">
							<img src="../../assets/feedback.png" width="30%" alt="Feedback" />
							<div class="desc pt-3">
								Please share with us any feedback you have, so we can improve together.
								We hope we can help you grow and remember - never limit your creativity!
								Happy streaming!
								<div class="mt-3">
									<a :href="TWITTER" target="_blank"><img src="../../assets/twitter.png" width="48" alt="Twitter" /></a>
									<a :href="DISCORD" target="_blank"><img src="../../assets/discord.png" width="48" alt="Discord" /></a>
								</div>
							</div>
						</div>
					</v-flex>
				</v-layout>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	import { APP_CONFIG } from '../../utils/constants'
	import Points from '../Points'
	import PointsChange from './PointsChange'
	import AlertsInstructions from './AlertsInstructions'

	export default {
		name: 'Intro',
		props: ['channel', 'POINTS_NAME', 'POINTS_IMG'],
		components: {
			Points,
			PointsChange,
			AlertsInstructions
		},
		data () {
			return {
				NAME: APP_CONFIG.NAME,
				TWITTER: APP_CONFIG.TWITTER,
				DISCORD: APP_CONFIG.DISCORD,
				baseURL: process.env.VUE_APP_API,
				status: !localStorage.getItem('loyal-config-intro'),
				step: 1,
				title: `Thank you for installing ${APP_CONFIG.NAME}!`,
				action: 'Next'
			}
		},
		methods: {
			nextIntroStep () {
				this.step += 1

				if (this.step === 2) {
					this.title = 'Customization Options'
				} else if (this.step === 3) {
					this.title = 'Loyalty Points'
				} else if (this.step === 4) {
					this.title = 'Rewards'
				} else if (this.step === 5) {
					this.title = 'Feedback'
					this.action = 'Finish'
				} else {
					this.status = false
					localStorage.setItem('loyal-config-intro', true)
				}
			}
		}
	}
</script>
