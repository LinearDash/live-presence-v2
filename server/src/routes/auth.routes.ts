import express from "express";
import { login, logout, refreshSession, register } from "../controllers/auth.controller";

const router = express.Router()

router.post("/register", register);

router.post('/login', login)

router.post('/logout', logout)

router.get('/refresh', refreshSession)

export default router;
