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
  } catch (error: any) {
    console.error("========== AI CHAT ERROR ==========");
    console.error(error);

    if (error?.response) {
      console.error("Response Status:", error.response.status);
      console.error(
        "Response Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    if (error?.error) {
      console.error(
        "Groq Error:",
        JSON.stringify(error.error, null, 2)
      );
    }

    if (error?.cause) {
      console.error("Cause:", error.cause);
    }

    console.error("===================================");

    res.status(400).json({
      success: false,
      message:
        error?.message ?? "Something went wrong",
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
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message:
        error?.message ?? "Something went wrong",
    });
  }
};