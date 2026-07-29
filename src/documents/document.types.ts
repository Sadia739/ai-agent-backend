export interface UploadDocumentInput {
  userId: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
}