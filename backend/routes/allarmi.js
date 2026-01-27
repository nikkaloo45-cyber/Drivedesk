const express = require('express');
const router = express.Router();
const Allarme = require('../models/allarme');
const auth = require('../middleware/authMiddleware');

// GET ottieni lo storico degli allarmi
router.get('/', auth, async (req, res) => {
    try {
        const allarmi = await Allarme.find()
            .populate('veicolo', 'targa')
            .sort({timestamp: -1});   // ordinamento cronologico in base a timestamp
        res.json(allarmi);
    } catch (errore) {
        res.status(500).json({msg: 'Errore interno del server'});
    }
});

// PATCH aggiorna lo stato dell'allarme
router.patch('/:id', auth, async (req, res) => {
    try {
        const allarmeAggiornato = await Allarme.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});  //per aggiornare lo stato in: gestione o risolto
        if (!alarmeAggiornato) return res.status(404).json({msg: 'Allarme non trovato'});
        res.json(allarmeAggiornato);
    } catch (errore) {
        res.status(400).json({msg: 'Errore di aggiornamento stato allarme'});
    }
});

module.exports = router;