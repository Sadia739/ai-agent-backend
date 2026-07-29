export interface CreateMessageInput {
  conversationId: number;
  role: string;
  content: string;
}

export interface UpdateMessageInput {
  content: string;
}