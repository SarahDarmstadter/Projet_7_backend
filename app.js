const express = require('express');
require('dotenv').config();
const bodyParser =require('body-parser');
//path donne accès au chemin des images
const path = require('path');
const cors = require('cors');
const db = require("./models");
const postRouter = require('./routes/post.routes');
const likeRouter = require('./routes/likes.routes')
const commentRouter = require('./routes/comments.routes');
const userRouter = require('./routes/user.routes');
const helmet = require('helmet');
const session = require('express-session')
const expiryDate = new Date(Date.now() + 60 * 60 * 18000); // 18 hours

const app = express();
db.sequelize.sync()
  .then(()=> console.log("Connexion à mysql réussie !"))
  .catch((error)=> console.error(error))

app.use(helmet());
app.set('trust proxy', 1);

//Options pour sécuriser les cookies
app.use(session({
  secret: 'userId',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    expires: expiryDate
  }
}));

app.use(cors({origin : "http://localhost:8080"}));

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
app.use('/image', express.static(path.join(__dirname, 'image')))
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/like', likeRouter)
app.use('/api/auth', userRouter);

module.exports = app;