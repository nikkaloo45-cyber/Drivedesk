const express = require('express');
const router = express.Router();
const Utente = require('../models/utente');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const req = require("express/lib/request");
const res = require("express/lib/response");

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const utente = await Utente.findOne({email});
        if (!utente) return res.status(400).json({msg: 'Utente non trovato'});
        const passwordValid = await bcrypt.compare(password, utente.password);
        if (!passwordValid) return res.status(400).json({msg: 'Password errata'});
        const token = jwt.sign({id: utente._id, ruolo: utente.ruolo}, process.env.JWT_SECRET, {expiresIn: '12h'});
        res.json({token, utente: {email: utente.email, ruolo: utente.ruolo}});
    } catch (errore) {
        res.status(500).json({msg: 'Errore interno del server', errore: errore.message});
    }
});

module.exports = router;