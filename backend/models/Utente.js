const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const utenteSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ruolo: { type: String, default: 'Manager' }
});
utenteSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
module.exports = mongoose.model('Utente', utenteSchema);