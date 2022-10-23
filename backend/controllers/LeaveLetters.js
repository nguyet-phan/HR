import LeaveLetter from "../models/LeaveLettersModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize"

export const getLeaveLetters = async (req, res) => {
    try {
        let response;
        if (req.role === "Admin") {
            response = await LeaveLetter.findAll({
                attributes: ['uuid', 'startDay', 'reason', 'quantity_day', 'status'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await LeaveLetter.findAll({
                attributes: ['uuid', 'startDay', 'reason', 'quantity_day', 'status'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getLeaveLetterById = async (req, res) => {
    try {
        const leaveLetter = await LeaveLetter.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!leaveLetter) return res.status(404).json({ msg: "Không tìm thấy đơn nghỉ phép." });

        let response;
        if (req.role === "Admin") {
            response = await LeaveLetter.findOne({
                attributes: ['uuid', 'startDay', 'reason', 'quantity_day', 'status'],
                where: {
                    id: leaveLetter.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await LeaveLetter.findOne({
                attributes: ['uuid', 'startDay', 'reason', 'quantity_day', 'status'],
                where: {
                    [Op.and]: [{ id: leaveLetter.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createLeaveLetter = async (req, res) => {
    const { startDay, reason, quantity_day } = req.body;
    try {
        await LeaveLetter.create({
            startDay: startDay,
            reason: reason,
            // status: status,
            quantity_day: quantity_day,
            userId: req.userId
        })
        res.status(201).json({ msg: "Tạo đơn nghỉ phép thành công" })
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateLeaveLetter = async (req, res) => {
    try {
        const leaveLetter = await LeaveLetter.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!leaveLetter) return res.status(404).json({ msg: "Không tìm thấy đơn nghỉ phép." });

        const { startDay, reason, quantity_day } = req.body;
        if (req.role === "Admin") {
            await LeaveLetter.update({ startDay, reason, quantity_day }, {
                where: {
                    id: leaveLetter.id
                }
            });
        } else {
            if (req.userId !== leaveLetter.userId) return res.status(403).json({ msg: "Bạn không có quyền truy cập!" });
            await LeaveLetter.update({ startDay, reason, quantity_day }, {
                where: {
                    [Op.and]: [{ id: leaveLetter.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Sửa đơn nghỉ phép thành công!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteLeaveLetter = async (req, res) => {
    try {
        const leaveLetter = await LeaveLetter.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!leaveLetter) return res.status(404).json({ msg: "Không tìm thấy đơn nghỉ phép." });

        const { startDay, reason, quantity_day } = req.body;
        if (req.role === "Admin") {
            await LeaveLetter.destroy({
                where: {
                    id: leaveLetter.id
                }
            });
        } else {
            if (req.userId !== leaveLetter.userId) return res.status(403).json({ msg: "Bạn không có quyền truy cập!" });
            await LeaveLetter.destroy({
                where: {
                    [Op.and]: [{ id: leaveLetter.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Xóa đơn nghỉ phép thành công!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}