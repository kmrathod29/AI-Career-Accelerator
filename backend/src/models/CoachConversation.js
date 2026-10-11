import mongoose from 'mongoose'

/* ── Message sub-schema ─────────────────────────────────────── */

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [8000, 'Message content cannot exceed 8000 characters'],
    },
    requestId: {
      type: String,
      maxlength: 100,
    },
  },
  {
    _id: true,
    timestamps: { createdAt: true, updatedAt: false },
  },
)

/* ── Conversation schema ─────────────────────────────────────── */

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'New Conversation',
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    /** Soft-delete: keep document but hide from user lists */
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

/* ── Indexes ─────────────────────────────────────────────────── */

// User's conversations list — sorted newest first, active only
conversationSchema.index({ userId: 1, deletedAt: 1, updatedAt: -1 })

/* ── JSON transform ──────────────────────────────────────────── */

conversationSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.userId
    delete ret.deletedAt
    return ret
  },
})

const CoachConversation = mongoose.model('CoachConversation', conversationSchema)

export default CoachConversation
