module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Company.associate = (models) => {
    Company.belongsTo(models.User, {
      foreignKey: 'idOwner',
      constraints: false,
    });
    Company.hasMany(models.User, {
      foreignKey: 'idCompany',
      allowNull: true,
    });
  };

  return Company;
};
