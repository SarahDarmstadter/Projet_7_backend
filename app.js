const express = require('express');
const bodyParser =require('body-parser');
//path donne accès au chemin des images
const path = require('path');
const cors = require('cors');
const db = require("./models");
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comments.routes');
const userRouter = require('./routes/user.routes');



const app = express();
db.sequelize.sync()
.then(()=> console.log("Connexion à mysql réussie !"))
.catch((error)=> console.error(error))

//ajout d'un middleware pour eviter les erreurs de CORS. Ce M. s'appliquera à toutes les routes. 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// Traitement des données en font-data du frontend (parse requests of content-type - application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser());
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/auth', userRouter);



module.exports = app;