import mongoose from 'mongoose';

const MessageReceiptSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  readAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster queries
MessageReceiptSchema.index({ messageId: 1, userId: 1 }, { unique: true });

export default mongoose.models.MessageReceipt || mongoose.model('MessageReceipt', MessageReceiptSchema);