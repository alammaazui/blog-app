// import module
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcrypt')
const USER = require('../models/user.model')

const signIn = async(req,res)=>{

    // console.log("client is requesting signIn ...");

    try {

        let {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({status:"error",msg:"provide complete data"})
        }
        
        const user = await USER.findOne({where :{email}})
        if(!user){
            
            return res.status(400).json({status:"error",msg:"email does not exist"})
        }
        // DB
        // db => user => email => {id , email , password, phoneNo, username}
        
        let isCompared = await bcrypt.compare(password,user.password)
        if(!isCompared){
            
            return res.status(400).json({status:"error",msg:"incorrect password"})
        }
        
        const token = jwt.sign({email:email ,role:"admin"},"SECRETKEY",{expiresIn:"1d"})

        res.status(200).json({status:"success",msg:"loggedin",data:{email,token}})
        
    } catch (error) {

        res.status(500).json({status:"error",msg:error.message})

    }
    
}

const signUp = async(req,res)=>{
    
    
    try {
        //data in request body  (email , username , password , phoneNo),
        // console.log("client is requesting signUp ...");
    
        console.log("data : ",req.body)
    
        let data = req.body
        let {email,username, password , phoneNo } = req.body
    
        // request data validation
    
        //1) email , password , username , phone must be provided
        if(!email || !password || !username || !phoneNo){
            // error for empty field 
            return res.status(400).json({status: "error" , msg :"please provide details to proceed"})
        }
        else if (!validator.isEmail(email)){
            
            return res.status(400).json({status: "error" , msg :"invalid email"})
        }
        else if (!validator.isStrongPassword(password)){
            
            return res.status(400).json({status: "error" , msg :"password must contain at least one special character , uppercase lowercase "})
            
        }
        else if (!validator.isAlphanumeric(username)){
            return res.status(400).json({status: "error" , msg :"special character not allowed in username"})
    
        }
    
        let salt = await bcrypt.genSalt(10)
    
        let encryptedPassword = await bcrypt.hash(password,salt)
    
        console.log(password);
        console.log(encryptedPassword);
    
    
        // database or filesystem

        const user = await USER.create({email,username,password:encryptedPassword})

        // 
    
        res.status(200).json({status : "success",msg:"user successfully registered" , data:user.toJSON() })
        
    } catch (error) {
        
        res.status(500).json({status:"error" ,msg :error.message})
    }

}


module.exports = {signIn, signUp}



