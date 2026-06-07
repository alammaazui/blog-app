const sequelize = require("../config/db.config");
const user = require("./user.model");
const author = require("./author.model");

const db = {};

db.user = user(sequelize);
db.author = author(sequelize);
// db.blog = author(sequelize);
// db.category = author(sequelize);
//

// Option 1
db.user.hasOne(db.author, {
  foreignKey: "user_id",
  allowNull: false,
});
db.author.belongsTo(db.user, {
  foreignKey: "user_id",
  allowNull: false,
});

// db.author.hasMany(db.blog,{
//     foreignKey: "author_id",
// })
// db.blog.belongsTo(db.author,{
//     foreignKey: "author_id",
// })

module.exports = db;
