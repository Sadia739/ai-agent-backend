export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  userId: number;
}

export interface UpdateCalendarEventInput {
  title?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
}

export interface ListCalendarEventsInput {
  userId: number;
  startDate?: string;
  endDate?: string;
}
