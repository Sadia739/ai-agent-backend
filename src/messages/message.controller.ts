import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createMessage,
  getMessagesByConversation,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "./message.service.js";

export const create = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const message = await createMessage(
      req.body,
      req.user!.id
    );

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: message,
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

export const getByConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const messages = await getMessagesByConversation(
      Number(req.params.conversationId),
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: messages,
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
    const message = await getMessageById(
      Number(req.params.id),
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: message,
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
    const message = await updateMessage(
      Number(req.params.id),
      req.body,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: message,
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

export const remove = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await deleteMessage(
      Number(req.params.id),
      req.user!.id
    );

    res.status(200).json({
      success: true,
      ...result,
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