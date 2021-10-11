
const modele = require("../models");
const Post = modele.posts;
const Comment = modele.comments;
const jwt = require('jsonwebtoken');


//Creation d'un post par un utilisteur 

exports.createPost = (req, res, next) => {
  try {
// Récuperation de l'id contenu dans le token pour identifier l'utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "CaputDraconis123!");
    const identifiant = decodedToken.userId;

//On lie l'utilisateur et son message et on verifie si la requete contient une image
    const postData = req.file ? 
    { 
      ...JSON.parse(req.body.post),
      image : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
      userId :identifiant
    } : 
    { 
      ...req.body,
      userId: identifiant
    }

    console.log(postData)

    Post.create(postData) 
      .then(data => {
        res.status(201).json({message: "post crée avec succès"})
      })
      .catch(err => {
        res.status(400).json({message : "erreur pendant la création"})
      })

  } catch(error) {
    res.status(400).json( { message : "une erreur s'est produite lors de la création du post"})
  }
};  

// Lire tous les posts 
  exports.readAllPosts = (req, res, next) => {
    Post.findAll({include : "comments"})
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

// lire tous les posts d'un user via le userId; 
// ????????????????????????????????????????????????????
//comment récuperer le userId d'un post pour afficher tous les posts ayant ce userId ? 
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

// retrouver les posts par sujet si le titre contient tel mot ? via le front ?

//suppression d'un post par son auteur 
exports.deletePost = (req, res, next) => {

  // récuper le postId 
  const id = req.params.id;
  console.log(id)
// Est-ce que ce sera au front d'envoyer l'id du post dans les params de l'url ? 
 Post.destroy({where : {id : req.params.id}})
    .then(data => {
      res.status(200).json({message : "post supprimé"});
    })
    .catch(err => {
      res.status(500).json({message: "une erreur s'est produite lors de la suppression"});
    });
};

//modifier un post 
exports.updatePost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, "CaputDraconis123!");
  const identifiant = decodedToken.userId;
try {
  
      let newData =  req.file ? 
      { 
        ...JSON.parse(req.body.post),
        image : `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
        userId :identifiant
      } : 
      { 
        ...req.body,
        userId: identifiant
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
  
  } catch (error) {
    console.log(error)
    res.status(400).json({message : "la modification a échoué"})
  }     
};




