import { makeHash } from "./hash";

export function buildEvidenceHash(evidence: {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: number;
  textSummary?: string;
}) {
  return makeHash({
    fileName: evidence.fileName,
    fileSize: evidence.fileSize,
    mimeType: evidence.mimeType,
    uploadedBy: evidence.uploadedBy,
    uploadedAt: evidence.uploadedAt,
    textSummary: evidence.textSummary || null
  });
}
