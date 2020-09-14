/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');

const { getMessage } = require('../helpers/messages');
const db = require('../models');
const { User, Company } = require('../models');
const {
  generateJwt,
  generateRefreshJwt,
} = require('../helpers/jwt');

const saltRounds = 10;

class CompaniesController {
  // async index(request, response) {
  //   return response.jsonOK(null, 'Companies listed.');
  // }

  // async select(request, response) {
  //   return response.jsonOK(null, 'Company selected.');
  // }

  async create(request, response) {
    const {
      name,
      description,
      owner,
    } = request.body;

    const hash = bcrypt.hashSync(owner.password, saltRounds);

    // the creation of the company owner and the company itself are made in one transaction.
    const trx = await db.sequelize.transaction();

    let userOwner;
    let company;

    try {
      // first, create the user that is the company owner.
      // this is the only case that an user without a company is created.
      userOwner = await User.create({
        name: owner.name,
        email: owner.email,
        password: hash,
        idCompany: null,
      }, { transaction: trx });

      // at last, create the company referencing the ID of the created user.
      company = await Company.create({
        name,
        description,
        idOwner: userOwner.idUser,
      }, { transaction: trx });

      // update the company ID of the owner with the ID of the created company.
      userOwner.idCompany = company.id;
      userOwner.save();

      await trx.commit();
    } catch (err) {
      await trx.rollback();
      if (err.name === 'SequelizeUniqueConstraintError') {
        return response.jsonBadRequest(
          null,
          getMessage('company.create.email.not_unique'),
        );
      }
      return response.jsonBadRequest(null, err.name);
    }

    // login the company owner
    const token = generateJwt({ id: userOwner.idUser });
    const refreshToken = generateRefreshJwt({ id: userOwner.idUser });

    return response.jsonOK(
      {
        userOwner,
        company,
      },
      getMessage('company.create.success'),
      { token, refreshToken },
    );
  }

  async update(request, response) {
    const { id } = request.params;
    const { idUser } = request;

    const { body } = request;

    // not sure if it should be possible to change the company owner...
    // I'm considering that it isn't possible.
    const fields = ['name', 'description'];

    // only the owner can update the company info
    const company = await Company.findOne({
      where: {
        id,
        idOwner: idUser,
      },
    });

    if (!company) return response.jsonNotFound(null);

    // verify if there's a new value for that field.
    // if yes, then replace the old field value with newValue.
    fields.map((fieldName) => {
      const newValue = body[fieldName];
      if (newValue !== undefined) company[fieldName] = newValue;
    });

    await company.save();

    return response.jsonOK(
      company,
      getMessage('company.update.success'),
    );
  }
}

module.exports = CompaniesController;
