import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'flag', 'login'],
      required: true,
    },
    model: {
      type: String,
      required: true,
      index: true,
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      index: true,
    },
    changedBy: {
      type: String,
      default: 'system',
    },
    ipAddress: {
      type: String,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      default: 'unknown',
    },
    data: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

auditLogSchema.virtual('formattedDate').get(function () {
  return new Date(this.createdAt).toLocaleString();
});

const AuditLog = model('AuditLog', auditLogSchema);
export default AuditLog;
