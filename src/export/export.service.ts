import PDFDocument from "pdfkit";
import prisma from "../prisma/prisma.js";

export const exportConversationPDF = async (
  conversationId: number,
  userId: number
) => {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const doc = new PDFDocument({
    margin: 50,
  });

  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.on("error", reject);

    doc.fontSize(20).text(conversation.title);

    doc.moveDown();

    conversation.messages.forEach((message) => {
      doc
        .fontSize(12)
        .fillColor(message.role === "user" ? "blue" : "black")
        .text(
          `${message.role.toUpperCase()}: ${message.content}`,
          {
            align: "left",
          }
        );

      doc.moveDown();
    });

    doc.end();
  });
};