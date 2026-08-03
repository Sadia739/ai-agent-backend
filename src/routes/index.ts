import { Router } from "express";
import userRoutes from "./routes.js";
import conversationRoutes from "../conversations/conversation.routes.js";
import messageRoutes from "../messages/message.routes.js";
import aiRoutes from "../ai/ai.routes.js";
import documentRoutes from "../documents/document.routes.js";
import toolExecutionRoutes from "../tools/tool-execution.routes.js";
import exportRoutes from "../export/export.routes.js";


const router = Router();

router.get("/", (req, res) => {
  res.send("AI Agent Backend is Running 🚀");
});

// User Routes
router.use("/api/users", userRoutes);

// Conversation Routes
router.use("/api/conversations", conversationRoutes);

// Message Routes
router.use("/api/messages", messageRoutes);

// Ai Routes
router.use("/api/ai", aiRoutes);

// document Routes
router.use("/api/documents", documentRoutes);

router.use(
  "/api/tools",
  toolExecutionRoutes
);

// Export Routes
router.use("/api/export", exportRoutes);

export default router;