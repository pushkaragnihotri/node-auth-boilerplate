module.exports = {
	env: process.env.ENV || 'dev',
	port: process.env.PORT || 3670,
	mongoUrl:
		process.env.MONGODB_URI ||
		process.env.MONGO_HOST ||
		'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || 27017) + '/mydb',
	jwtSecret: 'data_secret_2020',
	jwtExpirationInSeconds: 36000,
}
