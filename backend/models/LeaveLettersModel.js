import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const LeaveLetters = db.define('leaveLetter', {

    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    startDay: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    // endDay: {
    //     type: DataTypes.DATEONLY,
    //     allowNull: false,
    // },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    reasonRefuse: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['1', '2', '3'],
        comment: "1:đang đợi duyệt - 2:được chấp thuận - 3:bị từ chối",
        defaultValue: 1
    },
    quantity_day: {
        type: DataTypes.FLOAT,
        allowNull: false,
        min: 0.5,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(LeaveLetters);
LeaveLetters.belongsTo(Users, { foreignKey: 'userId' })

export default LeaveLetters;