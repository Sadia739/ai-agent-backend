/*
  Warnings:

  - You are about to drop the column `embedding` on the `DocumentChunk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentChunk" DROP COLUMN "embedding";

-- CreateTable
CREATE TABLE "ToolExecution" (
    "id" SERIAL NOT NULL,
    "toolName" TEXT NOT NULL,
    "toolInput" TEXT NOT NULL,
    "toolOutput" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" INTEGER NOT NULL,

    CONSTRAINT "ToolExecution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToolExecution" ADD CONSTRAINT "ToolExecution_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
