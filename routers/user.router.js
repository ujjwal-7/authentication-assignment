const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authentication.middleware');
const upload = require('../middlewares/multer.middleware');

const router = express.Router();

router.get('/', authenticate, userController.getProfiles);

router.get('/:id', authenticate, userController.profileDetails);

router.put('/:id/update', userController.updateProfileDetails);

router.put('/:id/updatePhoto', authenticate, upload.single('profileImg'), userController.updateProfileImage);

router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;