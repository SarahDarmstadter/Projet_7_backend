'use strict';
const dbConfig = require("../config/db.config.js");


const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require("./post.model.js")(sequelize, Sequelize);
db.comments = require("./comments.model.js")(sequelize, Sequelize);
db.users = require("./user.models")(sequelize, Sequelize);


// mise en place des relations "one-to-many"
//Un utlisateur a plusieurs posts 
db.users.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
  });


// un utilisateur a plusieurs commentaires
db.users.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user"
});

//un post a plusieurs commentaires
db.posts.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.posts, {
  foreignKey: "postId",
  as: "post",
  onDelete: 'CASCADE',
});



module.exports = db;