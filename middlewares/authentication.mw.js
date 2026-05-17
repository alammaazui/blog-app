const jwt = require('jsonwebtoken')

const authentication = async (req,res,next)=>{

    try{
        `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsaUB1aS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkwMTQ3ODgsImV4cCI6MTc3OTA1Nzk4OH0.gPFerXWxJ3JH8govnnD54OjH6J2hEjvE-vOS6atK1yE`
        const authorization = req.headers.Authorization || req.headers.authorization 

        if(!authorization){
            return res.status(401).json({status:"error",msg:"authentication token required"})
        }
        // console.log("passed from authentication MW");
        // console.log("authorization value : " ,authorization );
        // 
        let jwtToken = authorization.split(" ")[1]

        console.log("token value : " ,jwtToken );

        // console.log("decoded : ",jwt.verify(jwtToken,"SECRETKEY"))
        
        jwt.verify(jwtToken,"SECRETKEY",(err,decoded)=>{

            if(err){
                return res.status(401).json({status:"error",msg:err.message})
            }
            else{
                req.email = decoded.email
                req.role = decoded.role
                next()

            }



        })

  
    }
    catch(error){

        res.status(500).json({err:error.message})

    }

}

module.exports = authentication

// 

// fetch('apiendpoint',{
//     headers:{"Authoriztion" :"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsaUB1aS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzkwMTQ3ODgsImV4cCI6MTc3OTA1Nzk4OH0.gPFerXWxJ3JH8govnnD54OjH6J2hEjvE-vOS6atK1yE"}
// })