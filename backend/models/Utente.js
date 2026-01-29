const mongoose = require('mongoose');

const utenteSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    ruolo: {type: String, default: 'Manager'}
});

module.exports = mongoose.model('Utente', utenteSchema);