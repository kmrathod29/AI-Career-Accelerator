import ATSAnalysis from '../models/ATSAnalysis.js'
import ResumeMatch from '../models/ResumeMatch.js'
import Notification from '../models/Notification.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

/* ── Profile completion calculation ───────────────────────────── */

function isCompletedValue(value) {
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined && String(value).trim() !== ''
}

/**
 * Calculate profile completion from User document data.
 * Mirrors the frontend calculateProfileCompletion logic.
 */
function calculateProfileCompletion(user) {
  const values = [
    user.firstName,
    user.lastName,
    user.email,
    ...Object.values(user.profile?.toObject?.() ?? user.profile ?? {}),
    ...Object.values(user.career?.toObject?.() ?? user.career ?? {}),
    ...Object.values(user.socialLinks?.toObject?.() ?? user.socialLinks ?? {}),
  ]

  if (!values.length) return 0
  const completed = values.filter(isCompletedValue).length
  return Math.round((completed / values.length) * 100)
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/dashboard
   Return authenticated user's dashboard data.
   ══════════════════════════════════════════════════════════════════ */

export async function getDashboard(req, res) {
  try {
    const userId = req.user._id

    /* ── Fetch data in parallel ── */
    const [
      atsAnalyses,
      totalAtsAnalyses,
      latestAnalysis,
      resumeMatches,
      totalResumeMatches,
      recentNotifications,
      unreadNotificationCount,
    ] = await Promise.all([
      // Recent ATS analyses for activity feed
      ATSAnalysis.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('resumeFileName overallScore createdAt status')
        .lean(),

      // Total count
      ATSAnalysis.countDocuments({ userId }),

      // Latest analysis for score display
      ATSAnalysis.findOne({ userId })
        .sort({ createdAt: -1 })
        .select('overallScore createdAt resumeFileName')
        .lean(),

      ResumeMatch.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('resumeFileName jobTitle overallMatchScore createdAt status')
        .lean(),

      ResumeMatch.countDocuments({ userId }),

      // Recent notifications
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Unread count
      Notification.countDocuments({ userId, read: false }),
    ])

    /* ── Build user data ── */
    const user = {
      name: `${req.user.firstName} ${req.user.lastName}`.trim(),
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      profileImage: req.user.profile?.avatar || '',
      profileCompletion: calculateProfileCompletion(req.user),
    }

    /* ── Build stats ── */
    // Compute average ATS score only if analyses exist
    let avgAtsScore = null
    if (totalAtsAnalyses > 0) {
      const scoreAgg = await ATSAnalysis.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avg: { $avg: '$overallScore' } } },
      ])
      avgAtsScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avg) : null
    }

    const stats = {
      atsAnalyses: totalAtsAnalyses,
      latestAtsScore: latestAnalysis?.overallScore ?? null,
      avgAtsScore,
      latestAnalysisDate: latestAnalysis?.createdAt ?? null,
      resumeMatches: totalResumeMatches,
    }

    /* ── Build recent activity from real events ── */
    const recentActivity = []

    // Add ATS analysis completions
    for (const analysis of atsAnalyses) {
      recentActivity.push({
        type: 'ats_analysis',
        text: `ATS analysis completed — Score: ${analysis.overallScore}/100`,
        detail: analysis.resumeFileName,
        time: analysis.createdAt,
        status: analysis.status || 'completed',
      })
    }

    for (const analysis of resumeMatches) {
      recentActivity.push({
        type: 'resume_match',
        text: `Resume match completed — Score: ${analysis.overallMatchScore}/100`,
        detail: analysis.jobTitle || analysis.resumeFileName,
        time: analysis.createdAt,
        status: analysis.status || 'completed',
      })
    }

    // Sort by time descending (most recent first)
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time))

    /* ── Build recent analyses list ── */
    const recentAnalyses = atsAnalyses.map((a) => ({
      id: a._id.toString(),
      fileName: a.resumeFileName,
      score: a.overallScore,
      date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
      status: a.status || 'completed',
    }))

    /* ── Build notifications ── */
    const notifications = recentNotifications.map((n) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      description: n.description,
      read: n.read,
      timestamp: new Date(n.createdAt).getTime(),
    }))

    return sendSuccess(res, {
      user,
      stats,
      recentActivity: recentActivity.slice(0, 10),
      recentAnalyses,
      recentResumeMatches: resumeMatches.map((a) => ({
        id: a._id.toString(),
        fileName: a.resumeFileName,
        jobTitle: a.jobTitle || '',
        score: a.overallMatchScore,
        date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
        status: a.status || 'completed',
      })),
      notifications,
      unreadNotificationCount,
    })
  } catch (error) {
    console.error('getDashboard error:', error.message)
    return sendError(res, 'Failed to load dashboard data', 500)
  }
}
