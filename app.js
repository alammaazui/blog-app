// import details start
const path = require('path')
const express = require('express')
const userRoutes = require('./routes/user.route')
const authorRoutes = require('./routes/author.route')
const authentication = require('./middlewares/authentication.mw')
const rootDir = require('./utils/path.utils')
// import end




const app = express()

app.use(express.json())

app.use('/profile',express.static(path.join(rootDir,'files')))

// app.use('/docs',express.static(path.join(rootDir,'docs')))
app.use('/api/v1/user',userRoutes)

// app.use()

app.use('/api/v1/author',authorRoutes)








// export details
module.exports = app