module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    idRole: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    paranoid: true,
    deletedAt: 'enabled',
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: 'User_Roles',
      foreignKey: 'idRole',
      otherKey: 'idUser',
    });
    Role.belongsTo(models.Company, {
      foreignKey: 'idCompany',
    });
  };

  return Role;
};
