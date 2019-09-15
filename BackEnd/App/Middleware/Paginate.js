module.exports = (req, res, next) => {
    if (typeof req.query.pageNo == 'undefined' || req.query.pageNo <= 0) {
        return res.send({
            status: 'INVALID_REQUEST',
            results: [],
            message: 'PageNo must be > 0'
        });
    } else {
        return next();
    }
}