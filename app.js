// import details start
const express = require('express')
const userRoutes = require('./routes/user.route')
const authorRoutes = require('./routes/author.route')
const authentication = require('./middlewares/authentication.mw')
// import end



const app = express()

app.use(express.json())

app.use('/api/v1/user',userRoutes)

// app.use()

app.use('/api/v1/author',authorRoutes)








// export details
module.exports = app