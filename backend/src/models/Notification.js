import mongoose from 'mongoose'

const NOTIFICATION_TYPES = [
  'success', 'error', 'warning', 'info', 'ai', 'job',
  'resume', 'interview', 'ats', 'career_roadmap', 'subscription', 'system',
]

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: 'info',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    actionLabel: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

/* ── Indexes for efficient queries ────────────────────────── */

// Primary query: user's notifications sorted by newest first
notificationSchema.index({ userId: 1, createdAt: -1 })

// Unread count query: user's unread notifications
notificationSchema.index({ userId: 1, read: 1 })

/* ── JSON transform ──────────────────────────────────────── */

notificationSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    // Map createdAt to timestamp (epoch ms) for frontend compatibility
    ret.timestamp = ret.createdAt ? new Date(ret.createdAt).getTime() : Date.now()
    delete ret._id
    delete ret.__v
    delete ret.userId
    return ret
  },
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
export { NOTIFICATION_TYPES }
