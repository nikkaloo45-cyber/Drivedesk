const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({msg: 'Accesso non autorizzato'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (errore) {
        res.status(400).json({msg: 'Token non valido'});
    }
}