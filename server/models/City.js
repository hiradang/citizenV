module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id_city: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_city: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  City.associate = (models) => {
    City.hasMany(models.District, {
      onDelete: 'cascade',
      foreignKey: 'id_city',
    });
  };
  return City;
};
