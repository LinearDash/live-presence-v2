import express from "express";
import { createUser, deleteUser, getAllUser } from "../controllers/user.controller";


const router = express.Router();

//Create and Delete User
router.post("/createUser", createUser)
router.delete("/deleteUser", deleteUser)

//Get all users
router.get("/getUsers", getAllUser);

export default router;
