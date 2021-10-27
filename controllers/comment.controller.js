const modele = require("../models");
const Post = modele.posts;
const Comment = modele.comments;
const jwt = require('jsonwebtoken');

//Creation d'un commentaire par un utilisteur 

exports.createComment = (req, res, next) => {
  try {
// Récuperation de l'id contenu dans le token pour identifier l'utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "CaputDraconis123!");
    const identifiant = decodedToken.userId;

//identification du post à commenter 
    const postId = req.params.postId;
    console.log("postId", postId)

//On lie l'utilisateur et son message et on verifie si la requete contient une image
    const commentData = req.file ? 
    { 
      ...JSON.parse(req.body.commentMessage),
      image : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
      userId :identifiant,
      postId : req.params.postId
    } :
    { 
      ...req.body,
      userId: identifiant,
      postId : req.params.postId

    }

    Comment.create(commentData) 
      .then(data => {
        res.status(201).json({message: "commentaire crée avec succès"})
      })
      .catch(function(error){
        console.log(error)
      })

  }catch(error) {
    res.status(400).json( { message : "une erreur s'est produite lors de la création du commentaire"})
  }
};  

// Lire tous les commentaires  
exports.readComments = (req, res) => {
  Comment.findAll({include : ["user", "post"]})
      .then(data => {
          res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite."
        })
      })
};

exports.readPostComments = (req, res) => {
  Comment.findAll({where : {postId : req.params.id}, include : ["user", "post"]})
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite."
        })
      })
  };
    
exports.readOneComment = (req, res) => {
  Comment.findOne({where : {id : req.params.id}})
      .then(comment => {
        res.status().json(comment);
      })
      .catch(function(error){
        console.log(error)
      })
};

exports.readUserComments = (req, res, next) => {
  Comment.findAll({where : {userId : req.params.userId}})
      .then(data => {
        res.status(200).json(data)
      })
      .catch( err => {
        console.log(err)
        res.status(400).json({message : "les posts de cet auteur sont indisponibles"})
      })
};

//suppression d'un com par son auteur 
exports.deleteComment = (req, res) => {
  const id = req.params.id;
  Comment.destroy({where : {id : req.params.id}})
      .then(data => {
        res.status(200).json({message : "commentaire supprimé"})
      })
      .catch(function(error){
        console.log(error)
      })
};

//modifier un commentaire  
exports.updateComment = (req, res) => {
  let newData =  req.file ? 
  { 
    ...req.body.comMessage,
    image : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
    id: req.params.id
  } : 
  { 
    ...req.body,
    id: req.params.id
  }

  if(req.file) {
    Comment.findByPk(req.params.id)
      .then(comment=>{
          let filename = comment.image.split("/image/")[1];
          fs.unlink(`image/${filename}`, 
          (err => {
            if (err) console.log(err);
            else {
              console.log(`\nDeleted file: image/${filename}`)
            }
          }))
      })
      .catch(function(error){
        console.log(error)
      })
  }

  Comment.update(newData, { where : {id : req.params.id}})
    .then( num => {
      if (num == 1) {
        res.status(200).json({message : "com modifié ! "}) 

      } else {
        res.status(400).json({message : "le com n'a pas été modifié"})} 
    })
    .catch( err => {
        res.status(400).json({message : "le com n'a pas été modifié catch n2"})
    })
};

  

