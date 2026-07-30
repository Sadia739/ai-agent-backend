import prisma from "../prisma/prisma.js";

export const retrieveDocumentContext = async (
  documentId: number
) => {
  const chunks = await prisma.documentChunk.findMany({
    where: {
      documentId,
    },
    orderBy: {
      chunkIndex: "asc",
    },
    take: 5, // Only first 5 chunks
  });

  return chunks
    .map((chunk : any) => chunk.content)
    .join("\n\n");
};