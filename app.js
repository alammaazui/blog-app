// import details start
const express = require('express')
const userRoutes = require('./routes/user.route')
// import end



const app = express()

app.use(express.json())

app.use('/api/v1/user',userRoutes)








// export details
module.exports = app