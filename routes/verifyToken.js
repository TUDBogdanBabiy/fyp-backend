const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth_token');
    //if (!token) return res.status('401').send('Access Denied');

    try {
        //const verified = jwt.verify(token, "secret");
        req.user = token;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}