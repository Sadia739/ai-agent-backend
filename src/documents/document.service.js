import prisma from "../prisma/prisma.js";
import { extractTextFromPDF } from "../rag/pdf.service.js";
import { splitIntoChunks } from "../rag/chunk.service.js";
import { saveChunks } from "../rag/chunk-storage.service.js";
export const uploadDocument = async (data) => {
    // Save document metadata
    const document = await prisma.document.create({
        data,
    });
    // Extract text from PDF
    const text = await extractTextFromPDF(data.filePath);
    // Split into chunks
    const chunks = splitIntoChunks(text);
    // Save chunks
    await saveChunks(document.id, chunks);
    return document;
};
//# sourceMappingURL=document.service.js.map