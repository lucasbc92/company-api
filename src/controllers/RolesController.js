/* eslint-disable class-methods-use-this */
const { getMessage } = require('../helpers/messages');

const { ownerCheck } = require('../helpers/user');

const { User, Role } = require('../models');

class RolesController {
  // only the owner can create a role for its own company
  async create(request, response) {
    const {
      name,
      description,
    } = request.body;

    const { idUser } = request;

    const user = await User.findByPk(idUser);

    const isOwner = await ownerCheck(user.idCompany, idUser);

    let role;

    if (isOwner) {
      try {
        role = await Role.create({
          name,
          description,
          idCompany: user.idCompany,
        });
      } catch (err) {
        console.log(err);
        return response.jsonBadRequest(null);
      }

      return response.jsonOK(
        role,
        getMessage('role.create.success'),
      );
    }
    return response.jsonBadRequest(
      null,
      getMessage('role.create.is_not_owner'),
    );
  }

  async delete(request, response) {
    const { id } = request.params;
    const { idUser } = request;

    const user = await User.findByPk(idUser);

    const isOwner = await ownerCheck(user.idCompany, idUser);

    if (isOwner) {
      const role = await Role.findOne({
        id,
        idCompany: user.idCompany,
      });

      await role.destroy();

      return response.jsonOK(
        role,
        getMessage('role.delete.success'),
      );
    }
    return response.jsonBadRequest(
      null,
      getMessage('role.delete.is_not_owner'),
    );
  }
}

module.exports = RolesController;
