import User from "../models/UserModel.js"

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Bạn chưa đăng nhập!" });
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: "Tài khoản không tồn tại!" });
    req.userId = user.id;
    req.role = user.role;
    next();
}

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: "Tài khoản không tồn tại!" });
    if (user.role !== "Admin") return res.status(403).json({ msg: "Không có quyền truy cập chức năng này" });
    next();
}