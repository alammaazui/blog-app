const express = require('express')
const {getAuthor,getAuthors,createAuthor,updateAuthor,deleteAuthor} = require('../contollers/author.controller')
const authentication = require('../middlewares/authentication.mw')
const authorization = require('../middlewares/authorization.mw')

const routes = express.Router()

routes.get('/',getAuthors)
routes.get('/:id',getAuthor)
routes.post('/',createAuthor)
routes.patch('/:id',updateAuthor)
routes.delete('/:id',deleteAuthor)


module.exports = routes