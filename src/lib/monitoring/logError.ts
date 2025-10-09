import * as Sentry from '@sentry/nextjs'
import { logEvent } from './logEvent'

Sentry.init({ dsn: process.env.SENTRY_DSN!, tracesSampleRate: 1.0 })

export async function logError(err: any, context: string) {
  console.error(context, err)
  Sentry.captureException(err)
  await logEvent('error', { context, message: err.message || String(err) })
}
