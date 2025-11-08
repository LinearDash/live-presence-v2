import express from "express";
import { createUser, deleteUser, getAllUser, getUser } from "../controllers/user.controller";


const router = express.Router();

//Create and Delete User
router.post("/createUser", createUser)
router.delete("/deleteUser", deleteUser)

//Get all users
router.get("/getUsers", getAllUser);
//Get specific User
router.get("/getUser/:id", getUser);

export default router;
