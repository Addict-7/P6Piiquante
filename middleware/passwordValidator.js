const passwordValidator = require('../models/passwordValidator');

module.exports = (req, res, next) => {

    const passwordVerify = passwordValidator.validate(req.body.password);
    if ( !passwordVerify ) {
        res.status(400).json({ message: 'Le mot de passe doit respecter le minimum demandé !' });
    } else {
        next();
    }
};




