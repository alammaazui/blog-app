const express = require('express')
const {signIn, signUp} = require('../contollers/user.controller')
const route = express.Router()

route.post('/signin',signIn)

route.post('/signup',signUp)


module.exports = route