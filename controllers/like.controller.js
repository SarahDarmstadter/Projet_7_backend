const modele = require("../models");
const Post = modele.posts;
const Like = modele.likes;
const jwt = require('jsonwebtoken');

//Creation d'un commentaire par un utilisteur 

exports.createLike = (req, res, next) => {
  try {
// Récuperation de l'id contenu dans le token pour identifier l'utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "CaputDraconis123!");
    const identifiant = decodedToken.userId;

//identification du post à commenter 
    const postId = req.params.postId;
    console.log("postId", postId)

//nombre de like à compter 
const like = 1

//On lie l'utilisateur et son message et on verifie si la requete contient une image
    const likeData =
    { like : 1,
      userId: identifiant,
      postId : req.params.postId
    }

    Like.create(likeData) 
      .then(data => {
        res.status(201).json({message: "like crée avec succès"})
      })
      .catch(function(error){
        console.log(error)
      })

  } catch(error) {
    res.status(400).json( { message : "une erreur s'est produite lors de la création du like"})
  }
};  

//suppression d'un com par son auteur 
exports.deleteLike = (req, res) => {
    Like.destroy({where : {userId : req.params.userId, postId : req.params.postId}})
      .then( data => {
        res.status(200).json({message : "like supprimé"})
      })
      .catch(function(error){
        console.log(error)
      })
};


