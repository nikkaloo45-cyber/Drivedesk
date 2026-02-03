const express = require('express');
const router = express.Router();
const allarmiController = require('../controllers/allarmeController');
const auth = require('../middleware/authMiddleware');

// GET storico allarmi
router.get('/', auth, allarmiController.getAllarmi);

// PATCH aggiorna allarme
router.patch('/:id', allarmiController.aggiornaAllarme);

module.exports = router;