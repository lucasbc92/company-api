module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    paranoid: true,
    deletedAt: 'enabled',
  });

  User.associate = (models) => {
    User.hasOne(models.Company, {
      foreignKey: 'idOwner',
      constraints: false,
    });
    User.belongsTo(models.Company, {
      foreignKey: 'idCompany',
      allowNull: true,
    });
  };

  User.prototype.toJSON = function removePassword() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
