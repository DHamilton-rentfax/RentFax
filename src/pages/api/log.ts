// src/pages/api/log.ts
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API endpoint to receive log events from the client-side.
 * This allows browser-based events (clicks, UI errors, etc.) to be captured
 * and stored in the server's logs, visible in the Vercel dashboard.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, level = 'info', meta, environment } = req.body;

    const logPayload = {
      timestamp: new Date().toISOString(),
      message,
      level,
      meta,
      environment, // Should be 'client'
      source: 'api_log_endpoint',
    };

    // The core of the logging action: print the structured payload to the console.
    // Vercel automatically ingests these console logs.
    if (level === 'error') {
      console.error(JSON.stringify(logPayload));
    } else {
      console.log(JSON.stringify(logPayload));
    }

    res.status(200).json({ status: 'logged' });
  } catch (error) {
    // If the logging endpoint itself fails, log an error.
    // This is a meta-error, but important for debugging the logging system.
    console.error("Error in logging endpoint:", error);
    res.status(500).json({ error: 'Failed to process log event.' });
  }
}
