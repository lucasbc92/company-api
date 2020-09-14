const { User, Company } = require('../models');

async function ownerCheck(idCompany, idUser) {
  const isOwner = await User.findOne({
    include: [{
      model: Company,
      where: {
        id: idCompany,
        idOwner: idUser,
      },
    }],
  });

  // convert to boolean value
  return !!isOwner;
}

module.exports = { ownerCheck };
