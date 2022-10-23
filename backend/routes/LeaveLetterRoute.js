import express from "express";
import {
    getLeaveLetters,
    getLeaveLetterById,
    createLeaveLetter,
    updateLeaveLetter,
    deleteLeaveLetter
} from "../controllers/LeaveLetters.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/leaveLetters', verifyUser, getLeaveLetters);
router.get('/leaveLetters/:id', verifyUser, getLeaveLetterById);
router.post('/leaveLetters', verifyUser, createLeaveLetter);
router.patch('/leaveLetters/:id', verifyUser, updateLeaveLetter);
router.delete('/leaveLetters/:id', verifyUser, deleteLeaveLetter);

export default router;