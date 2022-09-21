const rateLimiter = require('express-rate-limit');

module.exports = rateLimiter({
    windowMS: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false
});
