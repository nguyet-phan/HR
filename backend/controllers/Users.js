import User from "../models/UserModel.js"
import argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'personId', 'phoneNumber', 'phoneNumberRelative', 'address', 'birthday', 'idManager', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'personId', 'phoneNumber', 'phoneNumberRelative', 'address', 'birthday', 'idManager', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, personId, phoneNumber, phoneNumberRelative, address, birthday, idManager, email, password, confPassword, role } = req.body;
    const checkEmail = await User.findAll({ where: { email } });
    let checkPhoneNumber;
    let checkPhoneNumberRelative;
    if (phoneNumber) {
        checkPhoneNumber = await User.findAll({ where: { phoneNumber } });
    };
    if (phoneNumberRelative) {
        checkPhoneNumberRelative = await User.findAll({ where: { phoneNumberRelative } });
    }

    // const checkIdUser = await User.findAll({ where: { uuid } });
    const checkPersonId = await User.findAll({ where: { personId } });
    if (checkEmail.length !== 0)
        return res.status(404).json({ msg: "Email đã tồn tại trong hệ thống!" })
    if (checkPhoneNumber && checkPhoneNumber.length !== 0 && phoneNumber !== "")
        return res.status(404).json({ msg: "Số điện thoại đã tồn tại trong hệ thống!" })
    if (checkPhoneNumberRelative && checkPhoneNumberRelative.length !== 0 && phoneNumberRelative !== "")
        return res.status(404).json({ msg: "Số điện thoại người thân đã tồn tại trong hệ thống!" })
    // if (checkIdUser.length !== 0)
    //     return res.status(404).json({ msg: "Mã nhân viên đã tồn tại trong hệ thống!" })
    if (checkPersonId.length !== 0)
        return res.status(404).json({ msg: "CCCD/CMND đã tồn tại trong hệ thống!" })

    if (password !== confPassword)
        return res.status(400).json({ msg: "Mật khẩu chưa khớp!" })
    const hashPassword = await argon2.hash(password);

    try {
        await User.create({
            name: name,
            personId: personId,
            phoneNumber: phoneNumber,
            phoneNumberRelative: phoneNumberRelative,
            address: address,
            birthday: birthday,
            idManager: idManager,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ msg: "Đăng ký thành công" })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "Tài khoản không tồn tại!" });
    const { name, personId, phoneNumber, phoneNumberRelative, address, birthday, idManager, email, password, confPassword, role } = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword)
        return res.status(400).json({ msg: "Mật khẩu chưa khớp!" })

    try {
        await User.update({
            name: name,
            personId: personId,
            phoneNumber: phoneNumber,
            phoneNumberRelative: phoneNumberRelative,
            address: address,
            birthday: birthday,
            idManager: idManager,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }

        });
        res.status(200).json({ msg: "Sửa thành công" })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "Tài khoản không tồn tại!" });

    try {
        await User.destroy({
            where: {
                id: user.id
            }

        });
        res.status(200).json({ msg: "Xóa thành công" })
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}