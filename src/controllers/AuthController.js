/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');
const { User } = require('../models'); // same as db.User
// const { userSignIn, userSignUp } = require('../validators/user');
const { getMessage } = require('../helpers/messages');
// const { getSignUpError } = require('../helpers/auth');
const {
  generateJwt,
  generateRefreshJwt,
  verifyRefreshJwt,
  getTokenFromHeaders,
} = require('../helpers/jwt');

const saltRounds = 10;

class AuthController {
  async signin(request, response) {
    const { email, password } = request.body;

    const user = await User.findOne({
      where: { email },
    });

    const userMatch = user ? bcrypt.compareSync(password, user.password) : null;
    if (!userMatch) {
      return response.jsonBadRequest(
        null,
        getMessage('user.signin.invalid'),
      );
    }

    const token = generateJwt({ id: user.idUser });
    const refreshToken = generateRefreshJwt({ id: user.idUser });

    return response.jsonOK(
      user,
      getMessage('user.signin.success'),
      { token, refreshToken },
    );
  }

  async signup(request, response) {
    const {
      name,
      email,
      password,
      idCompany,
    } = request.body;
    // console.log({email, password});

    const hash = bcrypt.hashSync(password, saltRounds);

    let newUser;

    try {
      newUser = await User.create({
        name,
        email,
        password: hash,
        idCompany,
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return response.jsonBadRequest(
          null,
          getMessage('user.signup.email.not_unique'),
        );
      }
      return response.jsonBadRequest(
        null,
        err.name,
      );
    }
    const token = generateJwt({ id: newUser.idUser });
    const refreshToken = generateRefreshJwt({ id: newUser.idUser });

    return response.jsonOK(
      newUser,
      getMessage('user.signup.success'),
      { token, refreshToken },
    );
  }

  async refresh(request, response) {
    const token = getTokenFromHeaders(request.headers);

    // console.log(token);

    if (!token) {
      return response.jsonUnauthorized(null, 'Invalid token');
    }

    try {
      const decoded = verifyRefreshJwt(token);
      // console.log('Decoded refresh token', decoded);

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return response.jsonUnauthorized(null, 'Invalid token');
      }

      const meta = {
        token: generateJwt({ id: user.id }),
      };

      return response.jsonOK(null, '', meta);
    } catch (err) {
      return response.jsonUnauthorized(null, 'Invalid token');
    }
  }
}

module.exports = AuthController;
