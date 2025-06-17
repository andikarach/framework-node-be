const db = require("./db")
const { DataTypes, Model, ENUM } = require("sequelize");

class UserModel extends Model { }
UserModel.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: ENUM('active', 'inactive', 'banned'),
        allowNull: false,
        defaultValue: 'inactive',
    },
    verification_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0 = unverified,  1 = verified,  2 = rejected",
    },
    verification_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    indexes: [{
        unique: true,
        fields: ['id']
    }],
    sequelize: db.sequelize,
    modelName: 'user',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
});

if (false) {
    UserModel.sync({ alter: true }).then(() => {
        console.log("Successfully sync database");
    });
}

module.exports = UserModel
