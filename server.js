require('dotenv').config()
// const dotenv = require('dotenv')
// dotenv.config()
const app = require('./app');
const sequelize = require('./config/db.config');
const AUTHOR = require('./models/author.model');
const USER = require('./models/user.model');


// console.log(process.env);
// console.log(process.env.PORT);
// console.log(process.env.DB_HOST);
// let port = 3000
let port = process.env.PORT;


//
if(process.env.NODE_ENV == "development"){
  
  (async () =>{
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await USER.sync({force:false})
        console.log('user table created successfully');
         await AUTHOR.sync()
        console.log('author table created successfully');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      // 
  
  })();
}
else{
  (async () =>{
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await USER.sync()
        console.log('user table created successfully');
        await AUTHOR.sync()
        console.log('author table created successfully');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      // 
  
  })();

} 


app.listen(port , (err)=>{
    if(err){
        console.log(`server start error : ${err.message} `);

    }
    console.log(`server up  port details :${port} `);

})

