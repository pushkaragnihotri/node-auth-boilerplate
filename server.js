const mongoose = require('./common/services/mongoose.service')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

const { port } = require('./common/config/env.config')
const UsersRouter = require('./users/routes.config')

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Credentials', 'true')
	res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE')
	res.header('Access-Control-Expose-Headers', 'Content-Length')
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range')
	if (req.method === 'OPTIONS') {
		return res.send(200)
	} else {
		return next()
	}
})

app.use(express.json())
app.use(cookieParser())
UsersRouter(app)

app.get('/', (req, res) => {
	res.send('Tadaa..server is working')
})

app.listen(port, () => {
	console.log(`Server is listening at port ${port}`)
})

module.exports = app // for testing
