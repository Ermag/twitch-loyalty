import jwt from 'jsonwebtoken'

// Helper class for authentication against an EBS service. Allows the storage of a token to be accessed across componenents.
// This is not meant to be a source of truth. Use only for presentational purposes.
export default class Authentication {
	constructor (auth) {
		let channelId = auth.channelId
		let token = auth.token
		let opaqueId = auth.userId
		let isMod = false
		let role = null
		let userId = null

		try {
			let decoded = jwt.decode(token)

			if (decoded.role === 'broadcaster' || decoded.role === 'moderator') {
				isMod = true
			}

			userId = decoded.user_id
			role = decoded.role
		} catch (e) {
			token = ''
			opaqueId = ''
		}

		this.state = {
			channelId,
			token,
			opaqueId,
			isMod,
			userId,
			role
		}
	}

	isLoggedIn () {
		return this.state.opaqueId[0] === 'U'
	}

	// This does guarantee the user is a moderator- this is fairly simple to bypass - so pass the JWT and verify
	// server-side that this is true. This, however, allows you to render client-side UI for users without holding on a backend to verify the JWT.
	// Additionally, this will only show if the user shared their ID, otherwise it will return false.
	isModerator () {
		return this.state.isMod
	}

	// Similar to mod status, this isn't always verifiable, so have your backend verify before proceeding.
	hasSharedId () {
		return !!this.state.userId
	}

	getToken () {
		return this.state.token
	}

	getUserId () {
		return this.state.userId
	}

	getChannelId () {
		return this.state.channelId
	}

	getOpaqueId () {
		return this.state.opaqueId
	}

	// Checks to ensure there is a valid token in the state
	isAuthenticated () {
		return this.state.token && this.state.opaqueId
	}
}
