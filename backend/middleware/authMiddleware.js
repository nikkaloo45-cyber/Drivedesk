const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Cerco l'header (minuscolo o maiuscolo)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    //Controllo la presenza di Bearer
    if (!authHeader?.startWith('Bearer ')) return res.status(401).json({msg: 'Accesso non autorizzato: token assente o errato'});
    // Estraggo solo il token escludendo 'Bearer '
    const token = authHeader.split(' ')[1];
    //Verifico il token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({msg: 'Accesso non autorizzato: token errato'});
        req.user = decoded.user;
        next();
    });
}