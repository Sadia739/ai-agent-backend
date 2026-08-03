import { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import { exportConversationPDF } from "./export.service.js";

export const exportPDF = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const conversationId = Number(req.params.id);

    if (isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const userId = req.user.id;

    const pdf = await exportConversationPDF(
      conversationId,
      userId
    );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=conversation-${conversationId}.pdf`
    );

    return res.send(pdf);
  } catch (error) {
    console.error("Export PDF Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export conversation.",
    });
  }
};