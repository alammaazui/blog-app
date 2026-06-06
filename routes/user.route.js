const express = require('express')
const {signIn, signUp} = require('../contollers/user.controller')
const upload = require('../config/multer.config')
const route = express.Router()

route.post('/signin',signIn)

route.post('/signup',upload.single('profile_pic'),signUp)


module.exports = route