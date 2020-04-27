let chai = require('chai')
let chaiHttp = require('chai-http')
var should = chai.should()
chai.use(chaiHttp)
let app = require('../index')
let userModel = require('../users/models/users.model')
const bcrypt = require('bcrypt')

let newUser = {
	firstName: 'John',
	lastName: 'Doe',
	email: 'johndoe@mail.com',
	password: 'p@ssw0rd',
	phoneNumber: 9999999999,
}
let loginCredentials = { email: 'johndoe@mail.com', password: 'p@ssw0rd' }

describe('Users Controller APIs Tests', () => {
	beforeEach(done => {
		//Before each test we empty the users collection
		userModel.deleteMany({}, err => {
			done()
		})
	})

	describe('POST /users/register', () => {
		it('it should NOT REGISTER a new user if any field is invalid and return statusCode 400', done => {
			chai
				.request(app)
				.post('/users/register')
				.send({ ...newUser, email: 'invalid-email' })
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.not.have.property('id')
					res.body.should.have.property('status').eql('error')
					res.body.should.have.property('message').eql('Invalid email format')
					done()
				})
		})
		it('it should REGISTER a new user and return statusCode 200', done => {
			chai
				.request(app)
				.post('/users/register')
				.send(newUser)
				.end((err, res) => {
					res.should.have.status(201)
					res.body.should.be.a('object')
					res.body.should.have.property('id')
					res.body.should.have.property('status').eql('no error')
					res.body.should.have.property('message').eql('User created successfully!')
					done()
				})
		})
		it('it should NOT REGISTER a new user if the email is already registered and return statusCode 409', done => {
			userModel.create(newUser)
			chai
				.request(app)
				.post('/users/register')
				.send(newUser)
				.end((err, res) => {
					res.should.have.status(409)
					res.body.should.be.a('object')
					res.body.should.not.have.property('id')
					res.body.should.have.property('status').eql('error')
					res.body.should.have.property('message').eql('Registration failed. Email is already registered!')
					done()
				})
		})
	})

	describe('POST /users/login', () => {
		it('it should NOT ATHENTICATE an unregistere user and return statusCode 404', done => {
			createDemoUser()
			chai
				.request(app)
				.post('/users/login')
				.send({ ...loginCredentials, email: 'invalid-email@mail.com' })
				.end((err, res) => {
					res.should.have.status(404)
					res.body.should.be.a('object')
					res.body.should.have.property('status').eql('error')
					res.body.should.have.property('message').eql('Authenticated failed. User not found!')
					done()
				})
		})
		it('it should NOT ATHENTICATE a registered user with incorrect password and return statusCode 401', done => {
			createDemoUser()
			chai
				.request(app)
				.post('/users/login')
				.send({ ...loginCredentials, password: 'incorrect-password' })
				.end((err, res) => {
					res.should.have.status(401)
					res.body.should.be.a('object')
					res.body.should.have.property('status').eql('error')
					res.body.should.have.property('message').eql('Authentication failed. Wrong password!')
					done()
				})
		})
		it('it should ATHENTICATE a valid user and return statusCode 200', done => {
			createDemoUser()
			chai
				.request(app)
				.post('/users/login')
				.send(loginCredentials)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status').eql('no error')
					res.body.should.have.property('message').eql('User authentication successfull!')
					done()
				})
		})
	})
})

createDemoUser = () => {
	const encryptedPassword = bcrypt.hashSync(newUser.password, 10)
	userModel.create({ ...newUser, password: encryptedPassword })
}
