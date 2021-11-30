const jwt = require('jsonwebtoken');

const verify = function (req, res, next) {
    const token = req.body.token || req.headers['token'];

    if (!token) {
        res.status(400).send('Token required');
    }

    try {
        const isVerified = jwt.verify(token, process.env.TOKEN_KEY);
        if (isVerified) {
            req.user = isVerified;
            return next();
        }
    }
    catch (err) {
        return res.status(400).send('Token is not valid');
    }
}

module.exports = verify;