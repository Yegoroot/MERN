// @desc    Logs request console
// на данный момент этот кастомный не используется а используеться morgan

const logger = (req, res, next) => {
	console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
	next()
}

module.exports = logger