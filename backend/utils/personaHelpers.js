// backend/utils/personaHelpers.js
import crypto from 'crypto';

const SIGNING_SECRET = process.env.PERSONA_WEBHOOK_SIGNING_SECRET;

if (!SIGNING_SECRET) {
  console.error('❌ Missing PERSONA_WEBHOOK_SIGNING_SECRET in .env');
  process.exit(1);
}

/**
 * Verifies Persona webhook signature using HMAC SHA-256
 * @param {Buffer|string} rawBody - Raw request body (Buffer preferred)
 * @param {string} signatureHeader - Value from `X-Persona-Signature`
 * @throws {Error} If the signature is missing or invalid
 */
export function verifyPersonaSignature(rawBody, signatureHeader) {
  if (!signatureHeader) {
    throw new Error('Missing Persona signature header');
  }

  const computed = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(rawBody)
    .digest();

  const received = Buffer.from(signatureHeader, 'hex');

  // Use timing-safe comparison
  if (computed.length !== received.length || !crypto.timingSafeEqual(computed, received)) {
    throw new Error('Invalid Persona signature');
  }

  return true;
}
