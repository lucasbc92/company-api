const Joi = require('@hapi/joi');
const { getValidatorError } = require('../helpers/validator');

const rules = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  password_confirmation: Joi.string().valid(Joi.ref('password')).required(),
};

const options = { abortEarly: false };

const userSignInValidator = (request, response, next) => {
  const { email, password } = request.body;

  const schema = Joi.object({
    email: rules.email,
    password: rules.password,
  });

  const { error } = schema.validate(
    { email, password },
    options,
  );

  if (error) {
    const errorMessages = getValidatorError(error, 'user.signin');
    return response.jsonBadRequest(null, '', { error: errorMessages });
  }

  return next();
};

const userSignUpValidator = (request, response, next) => {
  const { email, password, password_confirmation } = request.body;

  const schema = Joi.object({
    email: rules.email,
    password: rules.password,
    password_confirmation: rules.password_confirmation,
  });

  const { error } = schema.validate(
    { email, password, password_confirmation },
    options,
  );

  if (error) {
    const errorMessages = getValidatorError(error, 'user.signup');
    return response.jsonBadRequest(null, '', { error: errorMessages });
  }

  return next();
};

module.exports = { userSignInValidator, userSignUpValidator };
