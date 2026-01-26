const express = require('express');
const router = express.Router();
const Veicolo = require('../models/Veicolo');
const auth = require('../middleware/authMiddleware');

// GET Visualizza l'elenco dei veicoli della griglia
router.get('/', auth, async (req, res) => {
    try {
        const veicoli = await Veicolo.find();
        res.json(veicoli);
    } catch (errore) {
        res.status(500).json({msg: 'Errore interno del server'});
    }
});

// POST Aggiungi un nuovo veicolo nella griglia
router.post('/', auth, async (req, res) => {
    try {
        const { targa, nomeAutista, numeroAutista } = req.body;
        const nuovoVeicolo = new Veicolo({
            targa,
            nomeAutista,
            numeroAutista,
            stato: 'sosta',
            posizione: "0,0"
        });
        await nuovoVeicolo.save();
        res.status(201).json(nuovoVeicolo);
    } catch (errore) {
        res.status(400).json({msg: 'Errore nel salvataggio del veicolo'});
    }
});

// GET Visualizza dettagli di un veicolo
router.get('/:id', auth, async (req, res) => {
    try {
        const veicolo = await Veicolo.findById(req.params.id);
        if (!veicolo) return res.status(404).json({msg: 'Veicolo non trovato'});
        res.json(veicolo);
    } catch (errore) {
        res.status(500).json({msg: 'Errore interno del server'});
    }
});

// PUT Aggiorna dati del veicolo o dell'autista
router.put('/:id', auth, async (req, res) => {
    try {
        const veicoloAggiornato = await Veicolo.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.json(veicoloAggiornato);
    } catch (errore) {
        res.status(400).json({msg: 'Errore di aggiornamento del veicolo'});
    }
});

// DELETE Rimuovi veicolo
router.delete('/:id', auth, async (req, res) => {
    try {
        await Veicolo.findByIdAndDelete(req.params.id);
        res.json({msg: 'Veicolo cancellato'});
    } catch (errore) {
        res.status(500).json({msg: 'Errore interno del server'});
    }
});

module.exports = router;