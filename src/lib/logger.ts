/**
 * Performs the actual logging on the server.
 * Currently, it stringifies the log and prints to the console, which Vercel captures.
 * This can be expanded to send logs to a third-party service (Logtail, Datadog, etc.)
 */
const performServerLog = (message: string, level: string, meta: any) => {
  const logPayload = {
    timestamp: new Date().toISOString(),
    message,
    level,
    meta,
    environment: 'server',
  };

  // On Vercel, console.log and console.error are automatically routed to the deployment's logs.
  // We stringify the object to ensure all metadata is captured as a single log entry.
  if (level === 'error') {
    console.error(JSON.stringify(logPayload));
  } else {
    console.log(JSON.stringify(logPayload));
  }
};

/**
 * A universal logger that works on both the client and the server.
 * - On the client, it sends logs to the `/api/log` endpoint.
 * - On the server, it logs directly to the console to be captured by Vercel,
 *   avoiding a fragile and unnecessary network request to itself.
 *
 * @param message The main log message.
 * @param level The severity of the log ('info', 'warn', 'error').
 * @param meta Any additional structured data to include with the log.
 */
export async function logEvent(
  message: string,
  level: 'info' | 'warn' | 'error' = 'info',
  meta: any = {}
) {
  // Check if the code is running in a server-side environment (Node.js, Vercel Functions)
  if (typeof window === 'undefined') {
    // We are on the server. Log directly.
    performServerLog(message, level, meta);
    return; // Stop execution
  }

  // We are on the client. Send the log to our API endpoint.
  try {
    await fetch('/api/log', { // Use a relative URL, the browser handles the rest.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, level, meta, environment: 'client' }),
    });
  } catch (error) {
    // If the API call fails, log a warning to the browser console.
    // This helps debug issues with the logging endpoint itself.
    console.warn('Cloud log skipped:', error instanceof Error ? error.message : String(error));
  }
}
