<template>
	<v-dialog v-model="status" fullscreen>
		<v-card>
			<v-toolbar>
				<v-toolbar-title>{{ title }}</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-toolbar-items>
					<v-btn :color="isDarkTheme ? 'primary' : '#4b367c'" :dark="isDarkTheme" @click="nextIntroStep" flat>
						{{ action }}
						<v-icon right dark>arrow_forward</v-icon>
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>

			<div class="title pa-5">
				<div v-if="step === 1">
					This is an introduction guide to help you get started
					{{ NAME }} is designed to expand your viewership, engage your viewers and earn you real life money!
					By watching your channel, viewers will gain loyalty points (followers and subscribers receive more), or they can buy them with bits, for which you receive 80% of the revenue.
					Loyalty points can be used by viewers to claim rewards, challenges and memes. You can customize virtually every part of {{ NAME }} to make it unique to your personal and viewer’s experience!
				</div>

				<div v-else-if="step === 2">
					The first step is to set-up the live alert notifications for claiming rewards, so they can be seen by everyone on stream. Next, you can edit the name and image of your loyalty points to make them unique! Don’t forget that people can purchase them with bits to be able to claim more rewards.
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	import { APP_CONFIG } from '../../utils/constants'

	export default {
		name: 'Intro',
		props: ['isDarkTheme'],
		data () {
			return {
				...APP_CONFIG,
				status: true,
				step: 1,
				title: `Thank you for installing ${APP_CONFIG.NAME}!`,
				action: 'Next'
			}
		},
		methods: {
			nextIntroStep () {
				this.step += 1

				if (this.step === 2) {
					this.title = 'Customization options'
				}
			}
		}
	}
</script>
