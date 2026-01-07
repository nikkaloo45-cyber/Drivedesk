const mongoose = require('mongoose');
const veicoloSchema = new mongoose.Schema({
    targa: {type: String, required: true, unique: true},
    nomeAutista: {type: String, required: true},
    numeroAutista: {type: String, required: true},
    stato: {type: String, enum: ['movimento', 'sosta', 'allarme'], default: 'sosta'},
    livelloCarburante: {type: Number, default: 100},
    velocita: {type: Number, default: 0},
    posizione: {type: String},
    ultimoAggiornamento: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Veicolo', veicoloSchema);