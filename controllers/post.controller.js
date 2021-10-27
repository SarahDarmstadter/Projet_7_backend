
const modele = require("../models");
const Post = modele.posts;
const jwt = require('jsonwebtoken');
const fs = require('fs');

//Creation d'un post par un utilisteur 
exports.createPost = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "CaputDraconis123!");
    const identifiant = decodedToken.userId;

    const postData = req.file ? 
    { 
      ...JSON.parse(req.body.postMessage),
      image : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
      userId :identifiant
    } : 
    { 
      ...req.body,
      userId: identifiant
    }
    
    Post.create(postData) 
      .then(data => {
        res.status(201).json({message: "post crée avec succès"})
      })
      .catch(function(error){
        console.log(error)
      })
  }catch(error) {
    res.status(400).json( {message : "une erreur s'est produite lors de la création du post"})
    console.log(error)
  }
};  

// Lire tous les posts 
exports.readAllPosts = (req, res, next) => {
    Post.findAll({include : ["comments", "user", "likes"], order: [["createdAt","DESC"]]})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Une erreur s'est produite."
        });
      });
};
    
// lire un post via son postId (avec les commentaires si y'en a)
exports.readOnePost = (req, res, next) => {
  // récuper le postId 
    const id = req.params.id;
    console.log(id)
// Est-ce que ce sera au front d'envoyer l'id du post dans les params de l'url ? 
   Post.findByPk(id, {include : "comments"})
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json({message: "une erreur s'est produite pour la lecture du post ayant pour id: " + id});
      });
    
};

exports.readUserPosts = (req, res, next) => {
  console.log(req.params)
    Post.findAll({where : {userId : req.params.userId}})
    .then(data => {
      res.status(200).json(data)
    })
    .catch( err => {
      console.log(err)
      res.status(400).json({message : "les posts de cet auteur sont indisponibles"})
    
    })

};

//suppression d'un post par son auteur 
exports.deletePost = (req, res) => {
const id = req.params.id;
console.log(id)
Post.destroy({where : {id : req.params.id}})
    .then(data => {
    
      res.status(200).json({message : "post supprimé"});
    })
    .catch(function(error){
      console.log(error)
    })
};

//modifier un post 
exports.updatePost = (req, res) => {
      let newData =  req.file ? 
      { 
        ...JSON.parse(req.body.postMessage),
        image : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
        postId: req.params.id
      } : 
      { 
        ...req.body,
        postId: req.params.id
      }

      if(req.file) {
        Post.findByPk(req.params.id)
        .then(post=>{
          let filename = post.image.split("/image/")[1];
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

      Post.update(newData, { where : {id : req.params.id}})
        .then( num => {
          if (num == 1) {
            res.status(200).json({message : " post modifié ! "}) 
  
          } else {
            res.status(400).json({message : "le post n'a pas été modifié"})} 
        })
        .catch( err => {
            res.status(400).json({message : "le post n'a pas été modifié catch n2"})
        })
};




  



