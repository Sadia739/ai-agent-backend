import {
  createCalendarEvent,
  listCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../calendar/calendar.service.js";

const formatEvent = (event: {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: Date;
  endTime: Date;
}) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  location: event.location,
  startTime: event.startTime.toISOString(),
  endTime: event.endTime.toISOString(),
});

export type CreateCalendarEventArgs = {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
};

export type ListCalendarEventsArgs = {
  startDate?: string;
  endDate?: string;
};

export type UpdateCalendarEventArgs = {
  eventId: number;
  title?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
};

export type DeleteCalendarEventArgs = {
  eventId: number;
};

export const createCalendarEventTool = async (
  userId: number,
  args: CreateCalendarEventArgs
) => {
  const event = await createCalendarEvent({
    ...args,
    userId,
  });

  return {
    success: true,
    message: "Event created successfully.",
    event: formatEvent(event),
  };
};

export const listCalendarEventsTool = async (
  userId: number,
  args: ListCalendarEventsArgs = {}
) => {
  const events = await listCalendarEvents({
    userId,
    startDate: args.startDate,
    endDate: args.endDate,
  });

  return {
    success: true,
    count: events.length,
    events: events.map(formatEvent),
  };
};

export const updateCalendarEventTool = async (
  userId: number,
  args: UpdateCalendarEventArgs
) => {
  const { eventId, ...updateData } = args;

  const event = await updateCalendarEvent(
    eventId,
    userId,
    updateData
  );

  return {
    success: true,
    message: "Event updated successfully.",
    event: formatEvent(event),
  };
};

export const deleteCalendarEventTool = async (
  userId: number,
  args: DeleteCalendarEventArgs
) => {
  await deleteCalendarEvent(args.eventId, userId);

  return {
    success: true,
    message: "Event deleted successfully.",
  };
};
