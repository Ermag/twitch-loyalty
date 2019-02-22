const REWARDS = {
	limit: 25, // Maximum amount of rewards for a channel
	defaults: [ // Set of rewards added for every channel on creation
		{
			name: '<3',
			points: 250,
			image: 'heart.png'
		},
		{
			name: 'LUL',
			points: 250,
			image: 'lul.png'
		},
		{
			name: 'Kappa',
			points: 250,
			image: 'kappa.png'
		},
		{
			name: 'Challenge: Do the floss',
			points: 500,
			image: 'floss.gif'
		}
	]
}

module.exports = REWARDS
