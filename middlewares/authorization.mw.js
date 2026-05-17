
const authorization =  (allowedRole)=>{

    return (req,res,next)=>{

        if(req.role ==allowedRole){
            next()
        }
        else{
            return res.status(401).json({msg:"Unauthorized"})
        }

    }
}

module.exports = authorization