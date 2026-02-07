const Allarme = require('../models/Allarme');

// Ottieni lo storico degli allarmi
exports.getAllarmi = async (req, res) => {
    try {
        const allarmi = await Allarme.find()
            .populate('veicolo', 'targa')
            .sort({timestamp: -1});   // ordinamento cronologico in base a timestamp
        res.json(allarmi);
    } catch (errore) {
        res.status(500).json({msg: 'Errore interno del server'});
    }
};

// Aggiorna lo stato dell'allarme
exports.aggiornaAllarme = async (req, res) => {
    try {
        const allarmeAggiornato = await Allarme.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});  //per aggiornare lo stato in: gestione o risolto
        if (!allarmeAggiornato) return res.status(404).json({msg: 'Allarme non trovato'});
        res.json(allarmeAggiornato);
    } catch (errore) {
        res.status(400).json({msg: 'Errore di aggiornamento stato allarme'});
    }
};
