const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// Création de la voie de connection à la base de données
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// Ouverture de la connection MySQL
connection.connect(error => {
  if (error) throw error;
  console.log("Connection établie avec la base de données !");
});

module.exports = connection;