const REWARDS = {
	limit: 50, // Maximum amount of rewards for a channel
	defaults: [ // Set of rewards added for every channel on creation
		{
			name: 'Test', // TODO: Add fun rewards
			ref: 'initial-points',
			points: 10,
			image: 'test.png'
		}
	]
}

module.exports = REWARDS
