import { Router } from "express";
import { create, getAll, getById, remove, update, } from "./conversation.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/", authenticate, create);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, getById);
router.patch("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);
export default router;
//# sourceMappingURL=conversation.routes.js.map