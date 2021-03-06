'use strict';
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
require('dotenv').config();
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
db.likes = require("./likes.model.js")(sequelize, Sequelize)
db.posts = require("./post.model.js")(sequelize, Sequelize);
db.comments = require("./comments.model.js")(sequelize, Sequelize);
db.users = require("./user.models")(sequelize, Sequelize);

// mise en place des relations "one-to-many"
//Un utlisateur a plusieurs posts 


// un utilisateur a plusieurs commentaires
db.users.hasMany(db.comments, { 
  as: "comments", 
  onDelete : 'CASCADE',
  onUpdate : 'CASCADE' 
});

db.users.hasMany(db.posts, {
  as :"posts",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.users.hasMany(db.likes, { 
  as: "likes", 
onDelete : 'CASCADE', 
onUpdate : 'CASCADE' 
});

db.posts.hasMany(db.comments, {
  as :"comments",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.posts.hasMany(db.likes, {
  as :"likes",
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.posts.belongsTo(db.users, {foreignKey: "userId"});
db.comments.belongsTo(db.users, {foreignKey: "userId"});
db.likes.belongsTo(db.users, {foreignKey: "userId"});
db.comments.belongsTo(db.posts, {foreignKey:  "postId"});
db.likes.belongsTo(db.posts, {foreignKey: "postId"});

module.exports = db;