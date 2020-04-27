const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../config/env.config')

checkAuthorization = (req, res, next) => {
	// console.log(req.cookies)
	const token = req.cookies['accessToken']
	if (!token)
		return res.status(401).json({
			status: 'Unauthorization error',
			message: 'No Access token found',
		})
	try {
		const decoded = jwt.verify(token, jwt_secret)
		// console.log(decoded)
		req.user = decoded
		next()
	} catch (e) {
		return res.status(401).json({
			status: 'Unauthorization error',
			message: 'Invalid or expired token',
		})
	}
}

module.exports = checkAuthorization
