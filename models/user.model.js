const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/db.config");

const USER = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
    values: ENUM("guest", "admin", "author"),
    defaultValue: "guest",
  },
  profile_pic: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone_no: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
});

module.exports = USER