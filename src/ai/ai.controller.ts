import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  chatWithAI,
  chatWithDocument,
} from "./ai.service.js";

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
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const chatDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const reply = await chatWithDocument(
      req.body,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};