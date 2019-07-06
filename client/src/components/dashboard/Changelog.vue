<template>
	<div>
		<v-alert v-model="hasNewVersion" color="info" icon="info" dismissible>
			A new version of <strong>{{ NAME }}</strong> has been rolled out, click <a href="#" @click="isModalOpen = true">HERE</a> to see the changelog.
		</v-alert>

		<v-dialog v-model="isModalOpen" fullscreen>
			<v-card>
				<v-toolbar>
					<v-toolbar-title>Changelog 0.5.0</v-toolbar-title>

					<v-spacer></v-spacer>

					<v-toolbar-items>
						<v-btn :dark="isDarkTheme" @click="isModalOpen = false" icon>
							<v-icon>close</v-icon>
						</v-btn>
					</v-toolbar-items>
				</v-toolbar>

				<ul class="pa-4">
					<li class="pb-2">Added shop tab for viewers, loyalty points can now be purchased for bits. You receive 80% of the revenue from every purchase made!</li>
					<li class="pb-2">Added tutorial on the configuration page when setting up {{ NAME }} for the first time.</li>
					<li class="pb-2">Added support for the new extension component layout.</li>
					<li class="pb-2">Added various UI/UX improvements and bug fixes.</li>

					<div class="text-xs-center mt-2"><v-btn :dark="isDarkTheme" @click="isModalOpen = false">Close</v-btn></div>
				</ul>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import { APP_CONFIG } from '../../utils/constants'

	export default {
		name: 'Changelog',
		props: ['isDarkTheme'],
		data () {
			return {
				...APP_CONFIG,
				hasNewVersion: !localStorage.getItem('loyal-live-version050'),
				isModalOpen: false
			}
		},
		watch: {
			hasNewVersion (val) {
				if (!val) {
					localStorage.setItem('loyal-live-version050', true)
				}
			}
		}
	}
</script>
