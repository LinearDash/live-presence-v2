import express from "express";
import { deleteUser, getAllUser, getCurrentUser, getUser, updateUser } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";


const router = express.Router();
// router.use(authMiddleware)

//Delete User
router.delete("/deleteUser", authMiddleware, deleteUser);

//Get all users
router.get("/getUsers", getAllUser);

//Get specific User
router.get("/getUser/:id", getUser);

//Get Current User
router.get('/me', authMiddleware, getCurrentUser)

//Update User
router.post("/updateUser/:id", authMiddleware, updateUser);

export default router;
