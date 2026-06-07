const { DataTypes } = require("sequelize");



module.exports = (sequelize) => {
    
    const AUTHOR = sequelize.define('Author',{
    
        id:{
            type :DataTypes.UUID,
            defaultValue : DataTypes.UUIDV4,
            allowNull:false,
            primaryKey:true,
            unique:true
        },
        experience:{
            
            type:DataTypes.STRING,
            allowNull:false
        },
        qualification :{
            type:DataTypes.STRING,
            allowNull:false
    
        },
    
    
    
    })

    return AUTHOR
}

