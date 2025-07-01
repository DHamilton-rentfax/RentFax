// File: backend/utils/s3.js

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables early

import AWS from 'aws-sdk';

// ─── Validation ───────────────────────────────────────────────────────────────
if (!process.env.AWS_S3_BUCKET) {
  console.error('❌ Missing AWS_S3_BUCKET in .env');
  process.exit(1);
}
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ Missing AWS credentials in .env');
  process.exit(1);
}

// ─── Configure AWS SDK ────────────────────────────────────────────────────────
const s3 = new AWS.S3({
  accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:          process.env.AWS_REGION,
});

/**
 * Uploads a file buffer to AWS S3
 * @param {Buffer} buffer - The file buffer
 * @param {string} name - Original filename
 * @param {string} type - MIME type (e.g. image/png, application/pdf)
 * @param {boolean} isPublic - If true, sets ACL to 'public-read'
 * @returns {Promise<Object>} - S3 upload response object
 */
export const uploadToS3 = (buffer, name, type, isPublic = false) => {
  const key = `${Date.now()}_${name}`;
  const params = {
    Bucket:      process.env.AWS_S3_BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: type,
    ACL:         isPublic ? 'public-read' : 'private',
  };

  return s3.upload(params).promise();
};

/**
 * Deletes a file from S3
 * @param {string} key - S3 object key (filename)
 * @returns {Promise}
 */
export const deleteFromS3 = (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };
  return s3.deleteObject(params).promise();
};
