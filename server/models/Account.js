module.exports = (sequelize, DataTypes) => {
    const  Account= sequelize.define("Account", {
        id_account: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Account;
};