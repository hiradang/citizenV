module.exports = (sequelize, DataTypes) => {
  const Ward = sequelize.define('Ward', {
    id_ward: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    ward_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_ward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ward_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Ward.associate = (models) => {
    Ward.belongsTo(models.District, {
      onDelete: 'cascade',
      foreignKey: 'id_district',
    });
  };
  Ward.associate = (models) => {
    Ward.hasMany(models.Hamlet, {
      onDelete: 'cascade',
      foreignKey: 'id_ward',
    });
  };
  return Ward;
};
