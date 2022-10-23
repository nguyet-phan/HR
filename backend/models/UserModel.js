import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {

    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    // position: {
    //     type: DataTypes.ENUM,
    //     allowNull: false,
    //     values: ['1', '2', '3', '4'],
    //     comment: "1: Nhân viên part-time - 2: Nhân viên chính thức - 3: Quản lý - 4:Admin"
    // },
    personId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /\d+/g,
            len: {
                args: [10, 13],
                msg: 'Độ dài CCCD/CMND không đúng'
            }
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            custom(value) {
                if (value) {
                    is: /(0[3|5|7|8|9])+([0-9]{8})\b/g;
                    len: {
                        args: [10, 12];
                        msg: 'Số điện thoại phải từ 10-12 số'
                    }
                    if (value === this.phoneNumberRelative) {
                        throw new Error("Số điện thoại không được trùng với số điện thoại người thân.");
                    }

                }
                else {
                    this.phoneNumber = null;
                }
            }
        }
    },
    phoneNumberRelative: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            custom(value) {
                if (value) {
                    is: /(0[3|5|7|8|9])+([0-9]{8})\b/g;
                    len: {
                        args: [10, 12];
                        msg: 'Số điện thoại phải từ 10-12 số'
                    }
                    if (value === this.phoneNumber) {
                        throw new Error("Số điện thoại không được trùng với số điện thoại người thân.");
                    }

                }
                else {
                    this.phoneNumberRelative = null;
                }
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    idManager: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1,
    },
    daysAllowedLeave: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    // authVer: {
    //     type: DataTypes.INTEGER,
    //     defaultValue: 0
    // },
    // date: {
    //     type: DataTypes.DATEONLY,
    //     allowNull: false,
    //     defaultValue: date
    // },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        defaultValue: 123456,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

export default Users;