require('dotenv').config()
// const dotenv = require('dotenv')
// dotenv.config()
const app = require('./app')


// console.log(process.env);
// console.log(process.env.PORT);
// console.log(process.env.DB_HOST);
// let port = 3000
let port = process.env.PORT




app.listen(port , (err)=>{
    if(err){
        console.log(`server start error : ${err.message} `);

    }
    console.log(`server up  port details :${port} `);

})

