const express = require('express')
const router = express.Router()
const APP_CONFIG = require('../constants')

router.get('/get-extension', (req, res) => {
	res.redirect(APP_CONFIG.extensionURL)
})

module.exports = router
