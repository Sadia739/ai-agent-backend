import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  chat,
  chatDocument,
} from "./ai.controller.js";

import client from "./openai.js";
import { toolDeclarations } from "./tool-definitions.js";

// import { webSearch } from "../tools/web-search.tool.js";

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
// Tool Calling Test
// =====================================
router.get("/tool-test", async (req, res) => {
  try {
    const response =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: "What is 2+2?",
          },
        ],
        tools: toolDeclarations,
        tool_choice: "auto",
      });

    res.json(response);
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.error ?? err.message,
    });
  }
});

// =====================================
// Test Tavily Search
// =====================================
// router.get(
//   "/test-search",
//   async (req, res) => {
//     try {
//       const result = await webSearch(
//         "Today's AI news"
//       );

//       res.json({
//         success: true,
//         result,
//       });
//     } catch (error: any) {
//       console.error(error);

//       res.status(500).json({
//         success: false,
//         message:
//           error.response?.data ||
//           error.message,
//       });
//     }
//   }
// );

export default router;