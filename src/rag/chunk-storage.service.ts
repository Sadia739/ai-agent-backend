import prisma from "../prisma/prisma.js";

export const saveChunks = async (
  documentId: number,
  chunks: string[]
) => {
  await prisma.documentChunk.createMany({
    data: chunks.map((chunk, index) => ({
      documentId,
      content: chunk,
      chunkIndex: index,
    })),
  });
};