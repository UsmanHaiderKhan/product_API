const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');

const AuthController = require('../Controllers/auth.controller');

router.post('/signup', AuthController.createNewUser);

router.post('/login', AuthController.loggedIn);

router.delete('/:userId', checkAuth, AuthController.deleteUser);

module.exports = router;
