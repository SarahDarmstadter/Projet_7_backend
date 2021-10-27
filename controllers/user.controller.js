
const modele = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = modele.users;
const auth = require('../middleware/auth.js');
//Importation de file system(fs) pour ne pas saturer le serveur de fichiers inutiles après suppression ou modification
const fs = require('fs');

exports.signup =   (req, res, next) => {
  const password = req.body.password;
  console.log(password)
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/gm;
  if (password.match(regex)){
    User.findOne({ where : {email : req.body.email} })
    .then(data => {
        if (data) {
          res.status(409).json({message : "Email déjà utilisé"})
        } else {
//Bcrypt est une methode asynchrone donc on a un blov then et un bloc catch
        bcrypt.hash(req.body.password, 10)
              .then(hash => {
                const user = {
                  lastName: req.body.lastName,
                  firstName: req.body.firstName,
                  userName: req.body.userName,
                  email: req.body.email,
                  password: hash,
                  isAdmin: req.body.isAdmin ? req.body .isAdmin : false ,
                  imageUser: `${req.protocol}://${req.get('host')}/image/icon-left-font.png`
                };
                User.create(user)
                .then(user  => {
                  const token = jwt.sign({
                    email: user.email,
                    userId: user.id
                  }, "CaputDraconis123!", function(err, token){
                    res.status(200).json({
                      message : "utilisateur créé et connecté",
                      token : token,
                      userId: user.id
                    });
                  });
                 
                })
              })     
              .catch(err => {
                res.status(500).send({
                  message: "une erreur est survenue lors de la création de l'utilisateur."
                });
              });
            }
          })
        } else {
          throw "Le mot doit contenir entre 8 et 15 caractères, au moins une majuscule, un chiffre et un caractère spécial"
        }
};

exports.login = (req, res, next) => {
  User.findOne({where: {email : req.body.email}}) 
    .then(user => {
      if (user === null) {
        res.status(401).json({message: "utilisateur inexistant"});
      }else {
        bcrypt.compare(req.body.password, user.password, function(err, result){
          if (result){
            const token = jwt.sign({
              email: user.email,
              userId: user.id
            }, "CaputDraconis123!", function(err, token){
              res.status(200).json({
                message : "utilisateur connecté",
                token : token,
                userId: user.id
              });
            });
          } else{
            res.status(401).json({
              message : "mot de passe invalide"
            });
          }
        });
      }
    }).catch(err => {
        res.status(500).json({message: "erreur ca ne fonctionne pas"})
      })
}; 

exports.getProfile = async (req, res) => {
  //Récupération du token dans le header authorization. Le mot clé Bearer arrive en index0 et le token en index 1 
  const token = req.headers.authorization.split(' ')[1];
  //Vérification de la bonne correspondance des deux clés token
  const decodedToken = jwt.verify(token, "CaputDraconis123!");
  const identifiant = decodedToken.userId;  

  console.log("req.params.id",req.params.id)
        try {
            const userDetails = await User.findOne({where: {id: req.params.id}})
            res.status(200).send({
                status: 200,
                message: 'Data fetched Successfully',
                data: userDetails
            });
        }
        catch(error) {
         console.log(error)
        }
}; 

// exports.getOtherProfile = async (req, res) => {
//    try {
//      const userDetails = await User.findByPk(req.params.id) 
//            res.status(200).send({
//              status: 200,
//              message: 'Data fetched Successfully',
//              data: userDetails
//          })
//    }catch(error) {
//          return res.status(400).send({
//            message: 'Unable to fetch data',
//            errors: error,
//            status: 400
//          });
//    }
// };

exports.deleteProfile = (req, res) => {
    //Récupération du token dans le header authorization. Le mot clé Bearer arrive en index0 et le token en index 1 
    const token = req.headers.authorization.split(' ')[1];
    //Vérification de la bonne correspondance des deux clés token
    const decodedToken = jwt.verify(token, "CaputDraconis123!");
    const userId = decodedToken.userId;

    User.findOne({where: {id: userId}})
        .then(user => {
            User.destroy({where : {id : user.id}})
              .then(function(res){
                res.status(200).json({message: "utilisateur supprimé"})
              })
              .catch(function(error){
                  console.log("ERRUR SUPPRESSION", error)
              })
        })
        .catch(err => {
          res.status(500).json({message: "erreur pendant la suppression"})
        })
};
  
exports.modifyUser = (req, res) => { 
    //Récupération du token dans le header authorization. Le mot clé Bearer arrive en index0 et le token en index 1 
    const token = req.headers.authorization.split(' ')[1];
    //Vérification de la bonne correspondance des deux clés token
    const decodedToken = jwt.verify(token, "CaputDraconis123!");
    const userId = decodedToken.userId;
      
    const userObject = req.file ?
      {
        ...req.body,
    // req.protocol(http ou https) puis req.get('host') c'est la racine du serveur 
        imageUser: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
      } : 
      { ...req.body };

    User.findOne({ userId: userId })
      .then(user => {
        User.update(userObject, { where : {id : userId}})
            .then(function(){
              res.status(200).send({
                message: 'user modifié',
                data : userObject
              })
            })
            .catch(function(error){
              console.log(error)
            })
      })
      .catch(error => res.status(500).json({ error })
      )
};
