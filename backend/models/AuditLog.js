import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminEmail: { type: String, default: '' },
    action: {
      type: String,
      required: true,
      enum: ['BLOCK_USER', 'TEMP_BLOCK_USER', 'UNBLOCK_USER', 'DELETE_USER', 'UPDATE_ROLE', 'OTHER'],
    },
    targetUserId: { type: String, required: true },
    targetUserEmail: { type: String, default: '' },
    targetUserName: { type: String, default: '' },
    reason: { type: String, default: '' },
    blockType: { type: String, enum: ['permanent', 'temporary', 'none'], default: 'none' },
    blockedUntil: { type: Date },
    ipAddress: { type: String, default: '' },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
