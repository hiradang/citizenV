module.exports = (sequelize, DataTypes) => {
  const Hamlet = sequelize.define('Hamlet', {
    id_hamlet: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    hamlet_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_hamlet: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hamlet_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Hamlet.associate = (models) => {
    Hamlet.belongsTo(models.Ward, {
      onDelete: 'cascade',
      foreignKey: 'id_ward',
    });
  };
  return Hamlet;
};
