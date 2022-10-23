import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({ msg: "Tài khoản không tồn tại!" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: "Sai mật khẩu!" });
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const personId = user.personId;
    const phoneNumber = user.phoneNumber;
    const phoneNumberRelative = user.phoneNumberRelative;
    const address = user.address;
    const birthday = user.birthday;
    const idManager = user.idManager;
    const email = user.email;
    const role = user.role;
    res.status(200).json({ uuid, name, personId, phoneNumber, phoneNumberRelative, address, birthday, idManager, email, role });
}

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Bạn chưa đăng nhập!" });
    }
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'personId', 'phoneNumber', 'phoneNumberRelative', 'address', 'birthday', 'idManager', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: "Tài khoản không tồn tại!" });
    res.status(200).json(user);
}

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Đăng xuất thất bại!" });
        res.status(200).json({ msg: "Đăng xuất thành công!" });
    })
}