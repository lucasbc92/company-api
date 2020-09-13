require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenPrivateKey = process.env.JWT_TOKEN_PRIVATE_KEY;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY;

// normally, this option is set to 30 minutes, but for didatic testing, I set it to 30 days,
// so that you won't need to update the token in the API consumer.
const options = { expiresIn: '30 days' };

const refreshOptions = { expiresIn: '30 days' };

const generateJwt = (payload) => jwt.sign(payload, tokenPrivateKey, options);

const generateRefreshJwt = (payload) => jwt.sign(payload, refreshTokenPrivateKey, refreshOptions);

const verifyJwt = (token) => jwt.verify(token, tokenPrivateKey);

const verifyRefreshJwt = (token) => jwt.verify(token, refreshTokenPrivateKey);

const getTokenFromHeaders = (headers) => {
  const token = headers.authorization;
  return token
    ? token.slice(7, token.length) // to eliminate 'Bearer ' from token string;
    : null;
};

module.exports = {
  generateJwt,
  generateRefreshJwt,
  verifyJwt,
  verifyRefreshJwt,
  getTokenFromHeaders,
};
