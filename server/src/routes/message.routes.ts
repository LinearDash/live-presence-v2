import express from "express";
import { 
  getConversations, 
  sendMessage, 
  getMessageHistory, 
  markAsRead 
} from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all conversations for current user
router.get("/conversations", getConversations);

// Send a new message
router.post("/send", sendMessage);

// Get message history for a conversation
router.get("/:conversationId/history", getMessageHistory);

// Mark conversation messages as read
router.post("/:conversationId/read", markAsRead);

export default router;
