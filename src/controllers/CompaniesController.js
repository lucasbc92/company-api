/* eslint-disable class-methods-use-this */

const bcrypt = require('bcrypt');

const { User, Company } = require('../models');

const saltRounds = 10;

class CompaniesController {
  async index(request, response) {
    return response.json('Companies listed.');
  }

  async select(request, response) {
    return response.json('Company selected.');
  }

  async create(request, response) {
    // the creation of the company owner and the company itself are made in one transaction.
    const {
      name,
      description,
      owner,
    } = request.body;

    const hash = bcrypt.hashSync(owner.password, saltRounds);

    // first, create the user that is the company owner.
    // this is the only case that an user without a company is created.
    const userOwner = await User.create({
      name: owner.name,
      email: owner.email,
      password: hash,
      idCompany: null,
    });

    // at last, create the company referencing the ID of the created user.
    const company = await Company.create({
      name,
      description,
      idOwner: userOwner.id,
    });

    // update the company ID of the owner with the ID of the created company.
    userOwner.idCompany = company.id;
    userOwner.save();

    return response.json({
      userOwner,
      company,
    });
  }

  async update(request, response) {
    const { id } = request.params;
    const { idUser } = request;

    const { body } = request;
    const fields = ['name', 'description', 'idOwner'];

    // only the owner can update the company info
    const company = await Company.findOne({
      where: {
        id,
        idOwner: idUser,
      },
    });

    if (!company) return response.json('404 Not Found');

    fields.foreach((fieldName) => {
      const newValue = body[fieldName];
      if (newValue !== undefined) company[fieldName] = newValue;
    });

    await company.save(); // atualiza no banco

    return response.json(company);
  }
}

module.exports = CompaniesController;
