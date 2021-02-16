// VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().min(2).required(),
    surname: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8),
    type: Joi.string(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(8),
  });
  return schema.validate(data);
};

const attractionValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(255),
    price: Joi.number().required(),
    opening_time: Joi.string().required(),
    closing_time: Joi.string().required(),
    max_customers: Joi.number().required().min(1),
    min_age: Joi.number().required().min(1),
    max_weight: Joi.number().required(),
    min_height: Joi.number().required(),
    time_slots: Joi.array().required,
  });
  return schema.validate(data);
};

const bookingValidation = (data) => {
  const schema = Joi.object({
    customer_id: Joi.string().required(),
    attraction_id: Joi.string().required(),
    start_time: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.attractionValidation = attractionValidation;
module.exports.bookingValidation = bookingValidation;
