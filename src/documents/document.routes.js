import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { upload as uploadDocument } from "./document.controller.js";
const router = Router();
router.post("/upload", authenticate, upload.single("file"), uploadDocument);
export default router;
//# sourceMappingURL=document.routes.js.map