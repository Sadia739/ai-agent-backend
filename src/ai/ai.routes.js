import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { chat, chatDocument, } from "./ai.controller.js";
const router = Router();
router.post("/chat", authenticate, chat);
router.post("/document-chat", authenticate, chatDocument);
export default router;
//# sourceMappingURL=ai.routes.js.map