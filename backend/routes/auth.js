const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST registrazione utente
router.post('/registrazione', authController.registrazione);

// POST login utente
router.post('/login', authController.login);

module.exports = router;