module.exports = (sequelize, DataTypes) => {
    const  Account= sequelize.define("Account", {
        id_account: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Account;
};