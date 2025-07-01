// File: backend/utils/createAuditLog.js

import AuditLog from '../models/AuditLog.js';

/**
 * Create an audit log entry for tracking actions
 * @param {Object} params
 * @param {string} params.model - The name of the model (e.g., 'Report')
 * @param {string} params.documentId - The ID of the document being modified
 * @param {string} params.action - The action performed (e.g., 'Payment Received', 'Report Flagged')
 * @param {string} params.changedBy - The ID of the user performing the action
 * @param {Object} params.data - Additional data to store in the log
 */
export const createAuditLog = async ({ model, documentId, action, changedBy, data }) => {
  try {
    const auditLog = new AuditLog({
      action,
      model,
      reportId: documentId, // or change to `documentId` if you use that name consistently
      changedBy,
      data,
    });

    await auditLog.save();
    console.log(`📋 Audit Log Created: ${action} on ${model} ID ${documentId} by ${changedBy}`);
  } catch (err) {
    console.error('❌ Failed to create audit log:', err.message);
  }
};
