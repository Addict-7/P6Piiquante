const passwordValidator = require('password-validator');

const schema = new passwordValidator();

// Add properties to it
schema
.is().min(7)                                    // Minimum length 7
.is().max(15)                                  // Maximum length 15
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digit
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['']);

module.exports = schema;