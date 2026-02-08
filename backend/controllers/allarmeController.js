const Allarme = require('../models/Allarme');
const Veicolo = require('../models/Veicolo');

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
        const allarmeAggiornato = await Allarme.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},    //per aggiornare lo stato in: gestione o risolto
            {new: true}
        );

        if (!allarmeAggiornato) return res.status(404).json({msg: 'Allarme non trovato'});

        // Se lo stato è stato risolto, ripristino allo stato precedente del veicolo
        if(req.body.stato === 'risolto') {
            const veicolo = await Veicolo.findById(allarmeAggiornato.veicolo);  //Trovo il veicolo associato
            if(veicolo) {
                veicolo.stato = veicolo.velocita > 0 ? 'movimento' : 'sosta';
                await veicolo.save();
                console.log(`Veicolo ${veicolo.targa} ripristinato allo stato ${veicolo.stato}`);
            }
        }

        res.json(allarmeAggiornato);

    } catch (errore) {
        res.status(500).json({msg: 'Errore aggiornamento dello stato allarme'});
    }
};
