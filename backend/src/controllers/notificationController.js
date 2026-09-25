import mongoose from 'mongoose'
import Notification from '../models/Notification.js'
import { createNotification } from '../services/notificationService.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 20

/**
 * GET /api/notifications
 * Returns the authenticated user's notifications with pagination.
 */
export async function getNotifications(req, res) {
  try {
    const userId = req.user._id
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT))
    const skip = (page - 1) * limit

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ userId }),
      Notification.countDocuments({ userId, read: false }),
    ])

    // Transform _id → id and add timestamp for frontend compatibility
    const transformed = notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      description: n.description,
      read: n.read,
      actionUrl: n.actionUrl || '',
      actionLabel: n.actionLabel || '',
      metadata: n.metadata || null,
      timestamp: new Date(n.createdAt).getTime(),
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }))

    return sendSuccess(res, {
      notifications: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      unreadCount,
    })
  } catch (error) {
    console.error('getNotifications error:', error.message)
    return sendError(res, 'Failed to retrieve notifications', 500)
  }
}

/**
 * GET /api/notifications/unread-count
 */
export async function getUnreadCount(req, res) {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    })

    return sendSuccess(res, { unreadCount })
  } catch (error) {
    console.error('getUnreadCount error:', error.message)
    return sendError(res, 'Failed to get unread count', 500)
  }
}

/**
 * PATCH /api/notifications/:id/read
 */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid notification ID', 400)
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: true },
      { new: true },
    )

    if (!notification) {
      return sendError(res, 'Notification not found', 404)
    }

    return sendSuccess(res, { notification })
  } catch (error) {
    console.error('markAsRead error:', error.message)
    return sendError(res, 'Failed to mark notification as read', 500)
  }
}

/**
 * PATCH /api/notifications/:id/unread
 */
export async function markAsUnread(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid notification ID', 400)
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { read: false },
      { new: true },
    )

    if (!notification) {
      return sendError(res, 'Notification not found', 404)
    }

    return sendSuccess(res, { notification })
  } catch (error) {
    console.error('markAsUnread error:', error.message)
    return sendError(res, 'Failed to mark notification as unread', 500)
  }
}

/**
 * PATCH /api/notifications/read-all
 */
export async function markAllAsRead(req, res) {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true },
    )

    return sendSuccess(res, {
      modifiedCount: result.modifiedCount,
      unreadCount: 0,
    })
  } catch (error) {
    console.error('markAllAsRead error:', error.message)
    return sendError(res, 'Failed to mark all as read', 500)
  }
}

/**
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid notification ID', 400)
    }

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    })

    if (!notification) {
      return sendError(res, 'Notification not found', 404)
    }

    return sendSuccess(res, { message: 'Notification deleted' })
  } catch (error) {
    console.error('deleteNotification error:', error.message)
    return sendError(res, 'Failed to delete notification', 500)
  }
}

/**
 * DELETE /api/notifications
 * Clear all notifications for the authenticated user.
 */
export async function clearAllNotifications(req, res) {
  try {
    const result = await Notification.deleteMany({ userId: req.user._id })

    return sendSuccess(res, {
      deletedCount: result.deletedCount,
      message: 'All notifications cleared',
    })
  } catch (error) {
    console.error('clearAllNotifications error:', error.message)
    return sendError(res, 'Failed to clear notifications', 500)
  }
}

/**
 * POST /api/notifications/seed  (development only)
 * Creates sample notifications for testing.
 */
export async function seedNotifications(req, res) {
  try {
    const userId = req.user._id

    const seeds = [
      {
        userId,
        type: 'resume',
        title: 'Resume generated successfully',
        description: 'Your "Senior Full Stack Developer" resume is ready to review and export.',
        actionUrl: '/dashboard/resume-builder',
        actionLabel: 'View Resume',
      },
      {
        userId,
        type: 'ats',
        title: 'ATS score completed',
        description: 'Your resume scored 92/100 — excellent keyword alignment for target roles.',
        actionUrl: '/dashboard/ats-analyzer',
        actionLabel: 'View Report',
      },
      {
        userId,
        type: 'ai',
        title: 'AI Roadmap generated',
        description: 'Your personalized 90-day career roadmap with milestones is ready.',
        actionUrl: '/dashboard/career-roadmap',
        actionLabel: 'Open Roadmap',
        read: true,
      },
      {
        userId,
        type: 'success',
        title: 'Application submitted',
        description: 'Your application to Vercel — Frontend Engineer was sent successfully.',
        actionUrl: '/dashboard',
        actionLabel: 'Track Status',
        read: true,
      },
      {
        userId,
        type: 'info',
        title: 'Profile updated',
        description: 'Your career preferences and target roles have been saved.',
        actionUrl: '/dashboard/account',
        actionLabel: 'View Profile',
        read: true,
      },
      {
        userId,
        type: 'system',
        title: 'Welcome to AI Career Accelerator',
        description: 'Your account is set up. Start by building your resume or analyzing your ATS score.',
        actionUrl: '/dashboard',
        actionLabel: 'Get Started',
        read: true,
      },
    ]

    const created = await Promise.all(
      seeds.map((seed) => createNotification(seed)),
    )

    return sendSuccess(res, {
      message: `${created.length} seed notifications created`,
      count: created.length,
    }, 201)
  } catch (error) {
    console.error('seedNotifications error:', error.message)
    return sendError(res, 'Failed to seed notifications', 500)
  }
}
