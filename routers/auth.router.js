const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authentication.middleware');

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/logout', authenticate, authController.logout);

router.all('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;