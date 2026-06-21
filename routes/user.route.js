const express = require('express')
const {signIn, signUp , forgetPassword , resetPassword } = require('../contollers/user.controller')
const upload = require('../config/multer.config')
const route = express.Router()

route.post('/signin',signIn)

// route.post('/signup',upload.single('profile_pic'),signUp)
route.post('/signup',signUp)

route.post('/forget',forgetPassword)

route.post('/resetPassword/:token', resetPassword )


module.exports = route