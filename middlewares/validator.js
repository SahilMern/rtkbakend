const passwordValidator = require('password-validator');

// Create a schema for password validation
const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();
  
// Function to validate a password and get detailed errors
const passValidator = (password) => {
    return passwordSchema.validate(password, { list: true });
}

module.exports = passValidator;
