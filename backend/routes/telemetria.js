const express = require('express');
const router = express.Router();
const telemetriaController = require('../controllers/telemetriaController');

// POST quando viene rilevata una anomalia
router.post('/', telemetriaController.postTelemetria);

module.exports = router;
