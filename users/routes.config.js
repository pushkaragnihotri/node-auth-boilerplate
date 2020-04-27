const UserController = require('./controllers/users.controller')
const checkAuthorization = require('../common/middlewares/auth.middleware')
const validateRegistrationParams = require('./middlewares/registeration.validator')
const validateLoginParams = require('./middlewares/login.validator')

module.exports = app => {
	app.post('/users/register', validateRegistrationParams, UserController.register)
	app.post('/users/login', validateLoginParams, UserController.login)
	app.post('/users/logout', checkAuthorization, UserController.logout)
}
