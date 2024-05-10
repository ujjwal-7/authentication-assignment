const multer = require('multer');

/*const storage = multer.diskStorage(
    
    {
        destination: function(req, file, cb) {
            cb(null, "./public");
        },
        filename: function(req, file, cb) {

            
            cb(null, Date.now() + '-' + file.originalname);
        }
    },
    
);

const upload = multer({ 
    storage
});*/

const upload = multer({
    
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image with .jpg, .jpeg, or .png extension'))
        } 
        cb(undefined, true)
    }
})

module.exports = upload;
