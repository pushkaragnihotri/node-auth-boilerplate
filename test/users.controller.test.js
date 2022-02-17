const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../server');
const userModel = require('../users/models/users.model');
const config = require('../common/config/env.config');

const should = chai.should();
chai.use(chaiHttp);

const newUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@mail.com',
  password: 'p@ssw0rd',
  phoneNumber: 9999999999,
};

const loginCredentials = {
  email: 'johndoe@mail.com',
  password: 'p@ssw0rd',
};

createDemoUser = () => {
  const encryptedPassword = bcrypt.hashSync(newUser.password, 10);
  userModel.create({ ...newUser, password: encryptedPassword });
};

describe('Users Controller APIs Tests', () => {
  beforeEach(done => {
    // Before each test we empty the users collection
    userModel.deleteMany({}, err => {
      done();
    });
  });

  describe('POST /users/register', () => {
    it('it should NOT REGISTER a new user if any field is invalid and return statusCode 400', done => {
      chai
        .request(app)
        .post('/users/register')
        .send({ ...newUser, email: 'invalid-email' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('id');
          res.body.should.have.property('status').eql('Bad Request');
          res.body.should.have.property('message').eql('Invalid email format');
          done();
        });
    });
    it('it should REGISTER a new user and return statusCode 200', done => {
      chai
        .request(app)
        .post('/users/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('status').eql('OK');
          res.body.should.have.property('message').eql('User created successfully!');
          done();
        });
    });
    it('it should NOT REGISTER a new user if the email is already registered and return statusCode 409', done => {
      userModel.create(newUser);
      chai
        .request(app)
        .post('/users/register')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.not.have.property('id');
          res.body.should.have.property('status').eql('Conflict');
          res.body.should.have.property('message').eql('Registration failed. Email is already registered!');
          done();
        });
    });
  });

  describe('POST /users/login', () => {
    it('it should NOT ATHENTICATE an unregistered user and return statusCode 404', done => {
      createDemoUser();
      chai
        .request(app)
        .post('/users/login')
        .send({ ...loginCredentials, email: 'invalid-email@mail.com' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Not Found');
          res.body.should.have.property('message').eql('Authenticated failed. User not found!');
          done();
        });
    });
    it('it should NOT ATHENTICATE a registered user with incorrect password and return statusCode 401', done => {
      createDemoUser();
      chai
        .request(app)
        .post('/users/login')
        .send({ ...loginCredentials, password: 'incorrect-password' })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Unauthorized');
          res.body.should.have.property('message').eql('Authentication failed. Wrong password!');
          done();
        });
    });
    it('it should ATHENTICATE a valid user and return statusCode 200', done => {
      createDemoUser();
      chai
        .request(app)
        .post('/users/login')
        .send(loginCredentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('OK');
          res.body.should.have.property('message').eql('User authentication successfull!');
          done();
        });
    });
  });

  describe('POST /users/logout', () => {
    it('it should NOT LOGOUT an unlogged-in user and return statusCode 401', done => {
      chai
        .request(app)
        .post('/users/logout')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Unauthorized');
          res.body.should.have.property('message').eql('No Access token found');
          done();
        });
    });
    it('it should ATHENTICATE a valid user and return statusCode 200', done => {
      const payload = { email: loginCredentials.email };
      const secret = config.jwtSecret;
      const expiresIn = config.jwtExpirationInSeconds;
      const token = jwt.sign(payload, secret, { expiresIn });
      chai
        .request(app)
        .post('/users/logout')
        .set('Cookie', `accessToken=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('OK');
          res.body.should.have.property('message').eql('User logout successfully');
          done();
        });
    });
  });
});
