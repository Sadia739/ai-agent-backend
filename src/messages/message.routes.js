import { Router } from "express";
import { create, getByConversation, getById, update, remove, } from "./message.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/", authenticate, create);
router.get("/conversation/:conversationId", authenticate, getByConversation);
router.get("/:id", authenticate, getById);
router.patch("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);
export default router;
//# sourceMappingURL=message.routes.js.map