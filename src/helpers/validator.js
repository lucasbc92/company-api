/* eslint-disable array-callback-return */
const { getMessage } = require('./messages');

const getValidatorError = (error, messagePath) => {
  if (!error) return null;

  const errorMessages = {};

  error.details.map((detail) => {
    const { message } = detail;
    const { type } = detail;
    const { key } = detail.context;

    const path = `${messagePath}.${key}.${type}`;

    const customMessage = getMessage(path);
    if (!customMessage) {
      console.log('custom message not found for path: ', path);
    }

    errorMessages[key] = customMessage || message;
  });

  console.log(errorMessages);

  return errorMessages;
};

module.exports = { getValidatorError };
