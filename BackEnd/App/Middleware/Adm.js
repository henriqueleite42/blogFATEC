const admins = [
    '5d6b4bacd858f5435d87645f'
];

module.exports = (req, res, next) => {
    if ( req.userId.includes( admins ) ) {
        return next();
    } else {
        return res.status(403).send({ error: "No Authorization" });
    }
}