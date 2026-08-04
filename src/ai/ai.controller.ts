import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware.js";

import {
  chatWithAI,
  chatWithAIStream,
  chatWithDocument,
} from "./ai.service.js";

// ======================================================
// Normal Chat
// ======================================================

export const chat = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const reply = await chatWithAI(
      req.body,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      data: {
        reply,
      },
    });
  } catch (error: any) {
    console.error("========== AI CHAT ERROR ==========");
    console.error(error);

    if (error?.response) {
      console.error(
        "Response Status:",
        error.response.status
      );

      console.error(
        "Response Data:",
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );
    }

    if (error?.error) {
      console.error(
        "Groq Error:",
        JSON.stringify(
          error.error,
          null,
          2
        )
      );
    }

    if (error?.cause) {
      console.error("Cause:", error.cause);
    }

    console.error("===================================");

    res.status(400).json({
      success: false,
      message:
        error?.message ??
        "Something went wrong",
    });
  }
};

// ======================================================
// Streaming Chat
// ======================================================

export const chatStream = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const stream = chatWithAIStream(
      req.body,
      req.user!.id
    );

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Transfer-Encoding",
      "chunked"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.flushHeaders?.();

    // Stream tokens
    for await (const token of stream) {
      res.write(token);
    }

    res.end();
  } catch (error: any) {
    console.error("========== STREAM ERROR ==========");
    console.error(error);
    console.error("==================================");

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          error?.message ??
          "Streaming failed",
      });
    } else {
      res.end();
    }
  }
};
// ======================================================
// Document Chat
// ======================================================

export const chatDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const reply =
      await chatWithDocument(
        req.body,
        req.user!.id
      );

    res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message:
        error?.message ??
        "Something went wrong",
    });
  }
};