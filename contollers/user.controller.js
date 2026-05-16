// import module
const validator = require('validator')
const bcrypt = require('bcrypt')

const signIn = async(req,res)=>{

    console.log("client is requesting signIn ...");
    
}

const signUp = async(req,res)=>{
    
    
    try {
        //data in request body  (email , username , password , phoneNo),
        // console.log("client is requesting signUp ...");
    
        console.log("data : ",req.body)
    
        // let data = req.body
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
        // 
    
        res.status(200).json({status : "success",msg:"user successfully registered" , data:{email,username} })
        
    } catch (error) {
        
        res.status(500).json({status:"error" ,msg :error.message})
    }

}


module.exports = {signIn, signUp}



