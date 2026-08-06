import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createCalendarEvent,
  listCalendarEvents,
  getCalendarEventById,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "./calendar.service.js";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const event = await createCalendarEvent({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      userId: req.user!.id,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const events = await listCalendarEvents({
      userId: req.user!.id,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const event = await getCalendarEventById(
      Number(req.params.id),
      req.user!.id
    );

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const event = await updateCalendarEvent(
      Number(req.params.id),
      req.user!.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Calendar event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteCalendarEvent(
      Number(req.params.id),
      req.user!.id
    );

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
