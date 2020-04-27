const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

validateRegistrationParams = (req, res, next) => {
	let error = null
	if (!req.body.email || req.body.email.length == 0) {
		error = 'Email cannot be empty'
	} else if (!req.body.password || req.body.password.length == 0) {
		error = 'Passowrd cannot be empty'
	} else if (!req.body.email.match(emailFormat)) {
		error = 'Invalid email format'
	} else if (!req.body.phoneNumber || req.body.phoneNumber.length == 0) {
		error = 'Phone number cannot be empty'
	} else if (req.body.phoneNumber.length < 10 || req.body.phoneNumber.length > 10) {
		error = 'Invalid phone number'
	} else if (!req.body.firstName || req.body.firstName.length == 0) {
		error = 'First Name cannot be empty'
	} else if (!req.body.lastName || req.body.lastName.length == 0) {
		error = 'Last Name cannot be empty'
	}
	if (error)
		return res.status(400).json({
			status: 'error',
			message: error,
		})
	else next()
}

module.exports = validateRegistrationParams
