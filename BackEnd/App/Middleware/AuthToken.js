const jwt = require('jsonwebtoken');
const authKey = require('../../Config/Auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.cookies.blogFATEC;

    if (authHeader == undefined) {
        return res.status(401).send({ error: 'No Token Provided' });
    }

    const parts = authHeader.split(' ');

    if (parts.length != 2) {
        return res.status(401).send({ error: 'Token Malformated'});
    }

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token Malformated' });
    }

    jwt.verify(token, authKey.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Invalid Token' });
        }

        req.userId = decoded.id;

        return next();
    })
}