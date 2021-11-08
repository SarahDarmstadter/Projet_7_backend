const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    //Récupération du token dans le header authorization. Le mot clé Bearer arrive en index0 et le token en index 1 
    const token = req.headers.authorization.split(' ')[1]
    //Vérification de la bonne correspondance des deux clés token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    const userId = decodedToken.userId
    console.log(userId);
    
    //Vérification de la bonne correspondance des deux Id utilisateurs. Si on a un userId dans le corps de la requête && ET que celui-ci NE correspond PAS au userId
    if (req.body.userId && req.body.userId !== userId) {
        throw 'Utilisateur non admis'
    }else {
      next();
    }
  }catch {
    res.status(401).json({
      error: new Error('Requête non authentifiée')
    })
  }
};



