module.exports = (sequelize, DataTypes) => {
    const City = sequelize.define("City", {
        id_city: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        city_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity_city: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    return City;
};