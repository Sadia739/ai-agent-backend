import { Request, Response } from "express";

import { getToolExecutions } from "./tool-execution.service.js";

export const getConversationTools = async (
  req: Request,
  res: Response
) => {
  try {
    const conversationId = Number(req.params.conversationId);

    const tools =
      await getToolExecutions(conversationId);

    res.json({
      success: true,
      data: tools,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};