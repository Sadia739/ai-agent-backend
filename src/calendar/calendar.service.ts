import prisma from "../prisma/prisma.js";
import type {
  CreateCalendarEventInput,
  ListCalendarEventsInput,
  UpdateCalendarEventInput,
} from "./calendar.types.js";

export const createCalendarEvent = async (
  data: CreateCalendarEventInput
) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new Error("Invalid date format. Use ISO 8601 format.");
  }

  if (endTime <= startTime) {
    throw new Error("End time must be after start time.");
  }

  return prisma.calendarEvent.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      startTime,
      endTime,
      userId: data.userId,
    },
  });
};

export const listCalendarEvents = async (
  data: ListCalendarEventsInput
) => {
  const where: {
    userId: number;
    startTime?: { gte: Date };
    endTime?: { lte: Date };
  } = {
    userId: data.userId,
  };

  if (data.startDate) {
    where.startTime = { gte: new Date(data.startDate) };
  }

  if (data.endDate) {
    where.endTime = { lte: new Date(data.endDate) };
  }

  return prisma.calendarEvent.findMany({
    where,
    orderBy: { startTime: "asc" },
  });
};

export const getCalendarEventById = async (
  eventId: number,
  userId: number
) => {
  const event = await prisma.calendarEvent.findFirst({
    where: { id: eventId, userId },
  });

  if (!event) {
    throw new Error("Calendar event not found.");
  }

  return event;
};

export const updateCalendarEvent = async (
  eventId: number,
  userId: number,
  data: UpdateCalendarEventInput
) => {
  await getCalendarEventById(eventId, userId);

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.startTime !== undefined) {
    const startTime = new Date(data.startTime);
    if (isNaN(startTime.getTime())) {
      throw new Error("Invalid start time format.");
    }
    updateData.startTime = startTime;
  }
  if (data.endTime !== undefined) {
    const endTime = new Date(data.endTime);
    if (isNaN(endTime.getTime())) {
      throw new Error("Invalid end time format.");
    }
    updateData.endTime = endTime;
  }

  return prisma.calendarEvent.update({
    where: { id: eventId },
    data: updateData,
  });
};

export const deleteCalendarEvent = async (
  eventId: number,
  userId: number
) => {
  await getCalendarEventById(eventId, userId);

  await prisma.calendarEvent.delete({
    where: { id: eventId },
  });

  return { message: "Calendar event deleted successfully." };
};
