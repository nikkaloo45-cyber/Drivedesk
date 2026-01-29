const express = require('express');
const router = express.Router();
const Utente = require('../models/utente');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const req = require("express/lib/request");
const res = require("express/lib/response");

//Rotta registrazione
router.post('/register', async (req, res) => {
    try {
        const {email, password, ruolo} = req.body;
        let utente = await Utente.findOne({email});
        if (utente) return res.status(400).json({msg: 'Utente già esistente'});
        utente = new Utente({email, password, ruolo: ruolo || 'Manager'});

        //cripta la password
        const salt = await bcrypt.genSalt(10);
        utente.password = await bcrypt.hash(password, salt);

        await utente.save();
        res.status(201).json({msg: 'Utente registrato'});
    } catch (errore) {
        res.status(500).send('Errore interno del server');
    }
});

//Rotta login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const utente = await Utente.findOne({email});
        if (!utente) return res.status(400).json({msg: 'Utente non trovato'});
        const isMatch = await bcrypt.compare(password, utente.password);  //confronto password
        if (!isMatch) return res.status(400).json({msg: 'Password errata'});
        const payload = {
            user: {
                id: utente.id,
                ruolo: utente.ruolo
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000}, (err, token) => {
            if (err) throw err;
            res.json({token});
        });
    } catch (errore) {
        console.error(errore);
        res.status(500).json({msg: 'Errore interno del server'});
    }
});

module.exports = router;