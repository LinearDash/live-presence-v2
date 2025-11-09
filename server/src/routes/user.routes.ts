import express from "express";
import { deleteUser, getAllUser, getUser, updateUser } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";


const router = express.Router();
router.use(authMiddleware)

//Delete User
router.delete("/deleteUser", deleteUser);

//Get all users
router.get("/getUsers", getAllUser);
//Get specific User
router.get("/getUser/:id", getUser);

//Update User
router.post("/updateUser/:id", updateUser);

export default router;
