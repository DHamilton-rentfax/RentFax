import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import RentfaxReportDocument from './RentfaxReportDocument';

export const generateReport = async () => {
  try {
    const stream = await renderToStream(<RentfaxReportDocument />); 

    // Type assertion for the stream to add the 'toBuffer' method
    const streamWithBuffer = stream as NodeJS.ReadableStream & { toBuffer: () => Promise<Buffer> };

    streamWithBuffer.toBuffer = () => {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk as Buffer));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', (err) => reject(err));
        });
    };

    return streamWithBuffer;

  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate PDF report.");
  }
};