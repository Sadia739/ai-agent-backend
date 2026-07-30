import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  chat,
  chatDocument,
} from "./ai.controller.js";

import { webSearch } from "../tools/web-search.tool.js";

const router = Router();

router.post(
  "/chat",
  authenticate,
  chat
);

router.post(
  "/document-chat",
  authenticate,
  chatDocument
);

// =====================================
// Test Tavily Search
// =====================================
router.get(
  "/test-search",
  async (req, res) => {
    try {
      const result = await webSearch(
        "Today's AI news"
      );

      res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.response?.data ||
          error.message,
      });
    }
  }
);

export default router;