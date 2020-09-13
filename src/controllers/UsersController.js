/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable class-methods-use-this */
const { getMessage } = require('../helpers/messages');

const { User, Company } = require('../models');

class UsersController {
  // async index(request, response) {
  //   return response.json('Users listed.');
  // }

  // async select(request, response) {
  //   return response.json('User selected.');
  // }

  async update(request, response) {
    // created this function to avoid cope replication
    // it updates the user in the database.

    async function updateUser(user, body) {
      // if it's the company owner, then perform the update.
      const fields = ['name', 'email'];

      // verify if there's a new value for that field.
      // if yes, then replace the old field value with newValue.
      fields.map((fieldName) => {
        const newValue = body[fieldName];
        if (newValue !== undefined) user[fieldName] = newValue;
      });

      try {
        await user.save();
      // if trying to update an user email address with an email that already exists,
      // then catch an exception
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          return response.jsonBadRequest(
            null,
            getMessage('user.update.email.not_unique'),
          );
        }
        return response.jsonBadRequest(
          null,
          err.name,
        );
      }
      return response.jsonOK(
        user,
        getMessage('user.update.success'),
      );
    }

    const { id } = request.params;
    const { idUser } = request;

    const { body } = request;

    const user = await User.findByPk(id);

    // if the chosen user isn't the user itself,
    if (idUser !== user.id) {
      // only the user itself or the company owner can update the user info
      const ownerCheck = await User.findOne({
        include: [{
          model: Company,
          where: {
            id: user.idCompany,
            idOwner: idUser,
          },
        }],
      });

      // then check if the current logged in user is the owner of the company of the chosen user.
      if (ownerCheck) {
        return updateUser(user, body);
      }
      return response.jsonNotFound(null);
    } // if the chosen user is the user itself, then perform the update.
    return updateUser(user, body);
  }

  async delete(request, response) {
    const { id } = request.params;
    const { idUser } = request;

    let user;
    let ownerCheck;

    try {
      user = await User.findByPk(id);

      // only the user itself or the company owner can delete the user info
      ownerCheck = await User.findOne({
        include: [{
          model: Company,
          where: {
            id: user.idCompany,
            idOwner: idUser,
          },
        }],
      });
    } catch (err) {
      return response.jsonNotFound(null);
    }

    // if the chosen user is the user itself, then perform the deletion,
    // unless if it's a company owner.
    if (idUser === user.id) {
      if (!ownerCheck) {
        const result = await user.destroy();
        return response.jsonOK(result);
      }
      return response.jsonUnauthorized(
        null,
        getMessage('user.delete.is_owner'),
      );
    }

    // check if the current logged in user is the owner of the company of the chosen user.
    // if yes, then perform the deletion.
    if (ownerCheck) {
      const result = await user.destroy();
      return response.jsonOK(result);
    }
    return response.jsonNotFound(null);
  }
}

module.exports = UsersController;
