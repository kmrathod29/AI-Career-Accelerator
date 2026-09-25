import Notification from '../models/Notification.js'

/**
 * Reusable notification creation service.
 *
 * All backend modules (ATS, Resume, Skill Gap, Career Roadmap, etc.)
 * should use this service to create user notifications.
 *
 * @example
 * import { createNotification } from '../services/notificationService.js'
 *
 * await createNotification({
 *   userId: req.user._id,
 *   type: 'ats',
 *   title: 'ATS score completed',
 *   description: 'Your resume scored 92/100.',
 *   actionUrl: '/dashboard/ats-analyzer',
 *   actionLabel: 'View Report',
 * })
 */

/**
 * Create a single notification for a user.
 *
 * @param {Object} params
 * @param {import('mongoose').Types.ObjectId|string} params.userId - The target user
 * @param {string} params.type - Notification type (see NOTIFICATION_TYPES)
 * @param {string} params.title - Short notification title
 * @param {string} [params.description] - Longer description
 * @param {string} [params.actionUrl] - Frontend route to navigate to
 * @param {string} [params.actionLabel] - Button label (e.g. "View Report")
 * @param {Object} [params.metadata] - Arbitrary extra data
 * @returns {Promise<import('mongoose').Document>} The created notification document
 */
export async function createNotification({
  userId,
  type = 'info',
  title,
  description = '',
  actionUrl = '',
  actionLabel = '',
  metadata = null,
}) {
  if (!userId || !title) {
    throw new Error('createNotification requires userId and title')
  }

  const notification = await Notification.create({
    userId,
    type,
    title,
    description,
    actionUrl,
    actionLabel,
    metadata,
  })

  return notification
}

/**
 * Create multiple notifications at once (batch).
 *
 * @param {Array<Object>} items - Array of notification params (same shape as createNotification)
 * @returns {Promise<import('mongoose').Document[]>}
 */
export async function createNotifications(items) {
  if (!Array.isArray(items) || items.length === 0) return []

  const docs = items.map((item) => ({
    userId: item.userId,
    type: item.type || 'info',
    title: item.title,
    description: item.description || '',
    actionUrl: item.actionUrl || '',
    actionLabel: item.actionLabel || '',
    metadata: item.metadata || null,
  }))

  return Notification.insertMany(docs)
}
