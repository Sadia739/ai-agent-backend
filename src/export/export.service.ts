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
    size: "A4",
  });

  const buffers: Buffer[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.on("error", reject);

    // ==========================================
    // Header
    // ==========================================

    doc
      .fontSize(24)
      .fillColor("#1E3A8A")
      .text("AI Agent - Chat Export", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(13)
      .fillColor("black")
      .text(`Conversation: ${conversation.title}`);

    doc.text(
      `Exported On: ${new Date().toLocaleString()}`
    );

    doc.text(
      `Messages: ${conversation.messages.length}`
    );

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#999999")
      .stroke();

    doc.moveDown();

    // ==========================================
    // Messages
    // ==========================================

    conversation.messages.forEach((message) => {
      const isUser =
        message.role.toLowerCase() === "user";

      // Separator
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#DDDDDD")
        .stroke();

      doc.moveDown();

      // Role
      doc
        .fontSize(14)
        .fillColor(
          isUser ? "#2563EB" : "#16A34A"
        )
        .font("Helvetica-Bold")
        .text(
          isUser
            ? "👤 User"
            : "🤖 AI Assistant"
        );

      doc.moveDown(0.4);

      // Message
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("black")
        .text(message.content, {
          align: "left",
          lineGap: 4,
        });

      doc.moveDown(1.2);
    });

    // ==========================================
    // Footer
    // ==========================================

    doc.moveDown();

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor("#999999")
      .stroke();

    doc.moveDown();

    doc
      .fontSize(11)
      .fillColor("gray")
      .text("End of Conversation", {
        align: "center",
      });

    doc.end();
  });
};