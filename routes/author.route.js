const express = require('express')
const {getAuthor,getAuthors,createAuthor,updateAuthor,deleteAuthor} = require('../contollers/author.controller')
const authentication = require('../middlewares/authentication.mw')
const authorization = require('../middlewares/authorization.mw')

const routes = express.Router()

routes.get('/',getAuthors)
routes.get('/:id',getAuthor)
routes.post('/',authentication,authorization("admin"),createAuthor)
routes.patch('/:id',authentication,authorization("author"),updateAuthor)
routes.delete('/:id',authentication,deleteAuthor)


module.exports = routes