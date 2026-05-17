
const getAuthor = async(req,res)=>{
    try {
        res.status(200).json({status:"success",msg:"get single author resource accessed"})
    } catch (error) {
        
    }
}
const getAuthors = async(req,res)=>{
    try {
        res.status(200).json({status:"success",msg:"get all author resource accessed"})
    } catch (error) {
        
    }
}
const createAuthor = async(req,res)=>{
    try {
        res.status(200).json({status:"success",msg:"post author"})
    } catch (error) {
        
    }
}
const updateAuthor = async(req,res)=>{
    try {
        res.status(200).json({status:"success",msg:"update author"})
    } catch (error) {
        
    }
}
const deleteAuthor = async(req,res)=>{
    try {
        res.status(200).json({status:"success",msg:"delete author"})
    } catch (error) {
        
    }
}

module.exports = {getAuthor,getAuthors,createAuthor,updateAuthor,deleteAuthor}