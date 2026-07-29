import prisma from "../prisma/prisma.js";
export const saveChunks = async (documentId, chunks) => {
    await prisma.documentChunk.createMany({
        data: chunks.map((chunk, index) => ({
            documentId,
            content: chunk,
            chunkIndex: index,
        })),
    });
};
//# sourceMappingURL=chunk-storage.service.js.map