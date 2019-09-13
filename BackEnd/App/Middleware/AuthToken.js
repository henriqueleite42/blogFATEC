const jwt = require('jsonwebtoken');
const authKey = require('../../Config/Auth.json');

module.exports = (req, res, next) => {
    var token, scheme;

    if (typeof req.cookies.blogFATEC != 'undefined') {
        token = req.cookies.blogFATEC;
    } else if (typeof req.headers.authorization != 'undefined') {
        var authHeader = req.headers.authorization;

        const parts = authHeader.split(' ');

        if (parts.length != 2) {
            return res.status(401).send({ error: 'Token Malformated'});
        }

        [ scheme, token ] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send({ error: 'Token Malformated' });
        }

    } else {
        return res.status(401).send({ error: 'No Token Provided' });
    }

    jwt.verify(token, authKey.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Invalid Token' });
        }

        req.userId = decoded.id;

        return next();
    })
}