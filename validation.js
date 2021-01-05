// VALIDATION
const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).required(),
        surname: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8),
        type: Joi.string()

    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8)

    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;