const adm = require('../../Config/Adm.json');

module.exports = (req, res, next) => {
    if ( req.userId.includes( adm.admins ) ) {
        return next();
    } else {
        return res.status(403).send({ error: 'No Authorization' });
    }
}