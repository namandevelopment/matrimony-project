import express from "express";
import {
  getChatQuota,
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesRead,
} from "../../controllers/chat/chatController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 💬 REAL-TIME CHAT & MESSAGING ROUTES (WITH PLAN & TRIAL RESTRICTIONS)
 * --------------------------------------------------------------------------
 */

// 1. Quota & Plan Status (5 Free Trial Messages vs Paid Membership)
router.get("/quota-status", getChatQuota);

// 2. Active Conversations List & Initiation
router.get("/conversations", getConversations);
router.post("/conversations", getOrCreateConversation);

// 3. Message History
router.get("/messages/:conversationId", getMessages);

// 4. Send Message (Quota verified: Paid user -> unlimited, Free user -> 5 trial msgs)
router.post(["/messages", "/messages/send"], sendMessage);

// 5. Mark Messages Read
router.put("/messages/read", markMessagesRead);

export default router;
