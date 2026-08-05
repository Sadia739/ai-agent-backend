import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  chat,
  chatStream,
  chatDocument,
} from "./ai.controller.js";

import { webSearch } from "../tools/web-search.tool.js";

import client from "./openai.js";
import { toolDeclarations } from "./tool-definitions.js";

const router = Router();

// =====================================
// AI Chat
// =====================================

router.post(
  "/chat",
  authenticate,
  chat
);

// =====================================
// AI Streaming Chat (NEW)
// =====================================

router.post(
  "/chat/stream",
  authenticate,
  chatStream
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

// =====================================
// Test Groq Tool Calling
// =====================================

router.get(
  "/tool-test",
  async (req, res) => {
    try {
      const response =
        await client.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content:
                "What are today's AI news?",
            },
          ],
          tools: toolDeclarations,
          tool_choice: "auto",
        });

      res.json(response);
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        success: false,
        error:
          error.error ||
          error.response?.data ||
          error.message,
      });
    }
  }
);

export default router;