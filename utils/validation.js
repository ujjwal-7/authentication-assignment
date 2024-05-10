const validator = require('validator');

const validation = (name, email, password, phoneNumber, bio) => {

    let errors = {};

    if (!name || name.trim().length < 2 || name.trim().length > 50) {
        errors.name = 'Name must be between 2 and 50 characters.';
    }

    if (!email || !validator.isEmail(email)) {
        errors.email = 'Invalid email address.';
    }
    
    if (!password || !validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        errors.password = 'Password must be at least 8 characters long and include a digit, lowercase and uppercase letters and a symbol.';
    }

    if (!phoneNumber || !validator.isMobilePhone(phoneNumber, 'any')) {
        
        errors.phoneNumber = 'Invalid phone number.';
    }

    if (!bio || bio.trim().length < 2 || bio.trim().length > 100) {
        errors.bio = 'Bio must be between 2 and 100 characters.';
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
}

module.exports = validation;