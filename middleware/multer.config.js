const multer= require('multer');
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
//dicte l'emplacement de stockage - dans le dossier image 
    destination: (req, file, callback) => {
        callback(null, 'image')},
//rename les fichiers pour que meme si deux images ont le même nom lorsqu'elles sont uplaodées, elles n'aient plus le meme nom pour le stockage
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetypes];
        callback(null, Date.now() + name);
    }
});

module.exports = multer({storage}).single('image');