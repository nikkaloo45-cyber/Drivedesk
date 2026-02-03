const express = require('express');
const router = express.Router();
const veicoliController = require('../controllers/veicoloController');
const auth = require('../middleware/authMiddleware');

// GET Veicoli (griglia)
router.get('/', auth, veicoliController.getVeicoli);

// POST Veicolo (crea veicolo)
router.post('/', auth, veicoliController.creaVeicolo);

// GET Veicolo (dettagli)
router.get('/:id', auth, veicoliController.getVeicoloDettagli);

// PUT Veicolo (aggiorna)
router.put('/:id', auth, veicoliController.aggiornaVeicolo);

// DELETE Veicolo/
router.delete('/:id', auth, veicoliController.eliminaVeicolo);

module.exports = router;