import { Router } from "express";
import { getConversationTools } from "./tool-execution.controller.js";
const router = Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Tool route works!",
    });
});
router.get("/:conversationId", getConversationTools);
export default router;
//# sourceMappingURL=tool-execution.routes.js.map