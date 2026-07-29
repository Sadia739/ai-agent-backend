import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  updateConversation,
} from "./conversation.service.js";

export const create = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversation = await createConversation({
      title: req.body.title,
      userId: req.user!.id,
    });

    res.status(201).json({
      success: true,
      data: conversation,
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

export const getAll = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversations = await getConversations(req.user!.id);

    res.status(200).json({
      success: true,
      data: conversations,
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

export const getById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversation = await getConversationById(
      Number(req.params.id),
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await deleteConversation(
      Number(req.params.id),
      req.user!.id
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const update = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversation = await updateConversation(
      Number(req.params.id),
      req.user!.id,
      req.body.title
    );

    res.status(200).json({
      success: true,
      message: "Conversation updated successfully",
      data: conversation,
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