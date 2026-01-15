const validator = require('validator');


const validateSignUpData = (req) => {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("name is not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid!");
    }
    else if (validator.isStrongPassword(password)){
        throw new Error ("please enter a strong password");
    }
};

const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills" ];
    Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateProfileEditData,
};