const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
	},
	password: String,
	phoneNumber: Number,
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('users', UserSchema)
