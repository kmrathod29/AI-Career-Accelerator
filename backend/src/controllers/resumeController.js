import crypto from 'node:crypto'
import Resume from '../models/Resume.js'
import { getGeminiClient } from '../config/gemini.js'
import { createNotification } from '../services/notificationService.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

/* ── Default section order (matches frontend) ───────────────── */
const DEFAULT_SECTION_ORDER = [
  'personalInfo', 'summary', 'experience', 'education', 'skills',
  'projects', 'certifications', 'achievements', 'languages',
  'socialLinks', 'customSections',
]

/* ── Completion calculation (mirrors frontend logic) ────────── */
function calculateCompletion(resume) {
  let total = 0
  let filled = 0

  const pi = resume.personalInfo || {}
  const piFields = ['name', 'headline', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'portfolio']
  total += piFields.length
  filled += piFields.filter((f) => pi[f]?.trim?.()).length

  total += 1
  if (resume.summary?.trim?.()) filled += 1

  total += 1
  if (resume.experiences?.length > 0) filled += 1

  total += 1
  if (resume.education?.length > 0) filled += 1

  total += 1
  if (resume.skills?.length > 0) filled += 1

  total += 1
  if (resume.projects?.length > 0) filled += 1

  total += 1
  if (resume.certifications?.length > 0) filled += 1

  total += 1
  if (resume.achievements?.length > 0) filled += 1

  total += 1
  if (resume.languages?.length > 0) filled += 1

  return total > 0 ? Math.round((filled / total) * 100) : 0
}

/* ── Content hash for AI caching ────────────────────────────── */
function computeResumeHash(resume) {
  const content = JSON.stringify({
    personalInfo: resume.personalInfo,
    summary: resume.summary,
    experiences: resume.experiences,
    education: resume.education,
    skills: resume.skills,
    projects: resume.projects,
    certifications: resume.certifications,
    achievements: resume.achievements,
    languages: resume.languages,
    socialLinks: resume.socialLinks,
    customSections: resume.customSections,
  })
  return crypto.createHash('md5').update(content).digest('hex')
}

/* ── Transform for frontend ─────────────────────────────────── */
function transformResume(doc) {
  const obj = doc.toJSON ? doc.toJSON() : doc
  obj.completionPercentage = calculateCompletion(obj)
  return obj
}

/* ════════════════════════════════════════════════════════════════
   GET /api/resume
   ════════════════════════════════════════════════════════════════ */
export async function getResume(req, res) {
  try {
    const resume = await Resume.findOne({ userId: req.user._id })

    if (!resume) {
      // Return empty default so frontend can populate with clean state
      return sendSuccess(res, { resume: null })
    }

    return sendSuccess(res, { resume: transformResume(resume) })
  } catch (error) {
    console.error('getResume error:', error.message)
    return sendError(res, 'Failed to load resume', 500)
  }
}

/* ════════════════════════════════════════════════════════════════
   PUT /api/resume
   Create-or-update (upsert) the user's resume.
   ════════════════════════════════════════════════════════════════ */
export async function saveResume(req, res) {
  try {
    const userId = req.user._id
    const {
      personalInfo,
      summary,
      experiences,
      education,
      skills,
      projects,
      certifications,
      achievements,
      languages,
      socialLinks,
      customSections,
      sectionOrder,
      activeTemplate,
    } = req.body

    const updateData = {}

    if (personalInfo !== undefined) updateData.personalInfo = personalInfo
    if (summary !== undefined) updateData.summary = summary
    if (experiences !== undefined) updateData.experiences = experiences
    if (education !== undefined) updateData.education = education
    if (skills !== undefined) updateData.skills = skills
    if (projects !== undefined) updateData.projects = projects
    if (certifications !== undefined) updateData.certifications = certifications
    if (achievements !== undefined) updateData.achievements = achievements
    if (languages !== undefined) updateData.languages = languages
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks
    if (customSections !== undefined) updateData.customSections = customSections
    if (sectionOrder !== undefined) updateData.sectionOrder = sectionOrder
    if (activeTemplate !== undefined) updateData.activeTemplate = activeTemplate

    // MongoDB cannot update the same path in both $set and $setOnInsert.
    // sectionOrder is normally included in every autosave, so only provide
    // the default on insertion when the request did not supply an order.
    const insertData = { userId }
    if (sectionOrder === undefined) insertData.sectionOrder = DEFAULT_SECTION_ORDER

    const resume = await Resume.findOneAndUpdate(
      { userId },
      { $set: updateData, $setOnInsert: insertData },
      { new: true, upsert: true, runValidators: true },
    )

    return sendSuccess(res, { resume: transformResume(resume) })
  } catch (error) {
    console.error('saveResume error:', error.message)
    return sendError(res, 'Failed to save resume', 500)
  }
}

/* ════════════════════════════════════════════════════════════════
   DELETE /api/resume
   ════════════════════════════════════════════════════════════════ */
export async function deleteResume(req, res) {
  try {
    const result = await Resume.findOneAndDelete({ userId: req.user._id })

    if (!result) {
      return sendError(res, 'No resume found to delete', 404)
    }

    return sendSuccess(res, { message: 'Resume deleted' })
  } catch (error) {
    console.error('deleteResume error:', error.message)
    return sendError(res, 'Failed to delete resume', 500)
  }
}

/* ════════════════════════════════════════════════════════════════
   POST /api/resume/ai-suggestions
   Generate AI suggestions via Gemini.
   ════════════════════════════════════════════════════════════════ */

const ALLOWED_TYPES = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'ats', 'formatting', 'general']
const ALLOWED_SEVERITIES = ['low', 'medium', 'high']

function validateSuggestions(raw) {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((s) => s && typeof s === 'object' && typeof s.title === 'string' && typeof s.message === 'string')
    .slice(0, 10) // max 10 suggestions
    .map((s, idx) => ({
      id: `sug-${Date.now()}-${idx}`,
      type: ALLOWED_TYPES.includes(s.type) ? s.type : 'general',
      severity: ALLOWED_SEVERITIES.includes(s.severity) ? s.severity : 'medium',
      title: String(s.title).slice(0, 200),
      message: String(s.message).slice(0, 500),
      targetSection: typeof s.targetSection === 'string' ? s.targetSection : '',
      text: String(s.title).slice(0, 200), // for frontend compat
      section: typeof s.targetSection === 'string' ? s.targetSection : '',
    }))
}

async function generateSuggestions(client, prompt) {
  // Gemini can briefly return 503 while a model is under high demand. Retry
  // once on 503 so users do not have to manually retry a short-lived provider issue.
  try {
    return await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt,
    })
  } catch (error) {
    const status = error.statusCode || error.status
    if (status !== 503) throw error

    await new Promise((resolve) => setTimeout(resolve, 1000))
    return await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt,
    })
  }
}

export async function getAISuggestions(req, res) {
  try {
    const genAI = getGeminiClient()
    if (!genAI) {
      return sendError(res, 'AI suggestions are temporarily unavailable', 503)
    }

    const resume = await Resume.findOne({ userId: req.user._id })
    if (!resume) {
      return sendError(res, 'Create a resume first to get AI suggestions', 404)
    }

    // Check cache — skip Gemini if resume hasn't changed
    const currentHash = computeResumeHash(resume)
    if (
      resume.aiSuggestions?.resumeHash === currentHash &&
      resume.aiSuggestions?.suggestions &&
      resume.aiSuggestions.generatedAt
    ) {
      return sendSuccess(res, {
        suggestions: resume.aiSuggestions.suggestions,
        cached: true,
        generatedAt: resume.aiSuggestions.generatedAt,
      })
    }

    // Build prompt — only send relevant resume content
    const resumeContent = {
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      experiences: resume.experiences?.map((e) => ({
        company: e.company, role: e.role, description: e.description,
        startDate: e.startDate, endDate: e.endDate, currentlyWorking: e.currentlyWorking,
      })),
      education: resume.education?.map((e) => ({
        college: e.college, degree: e.degree, branch: e.branch, cgpa: e.cgpa,
      })),
      skills: resume.skills,
      projects: resume.projects?.map((p) => ({
        name: p.name, techStack: p.techStack, description: p.description,
      })),
      certifications: resume.certifications?.map((c) => ({
        name: c.name, issuer: c.issuer,
      })),
      achievements: resume.achievements?.map((a) => a.text).filter(Boolean),
      languages: resume.languages?.map((l) => ({
        language: l.language, proficiency: l.proficiency,
      })),
    }

    const targetRole = req.body.targetRole || ''

    const prompt = `You are an expert career consultant and resume reviewer. Analyze the following resume and provide actionable improvement suggestions.

${targetRole ? `TARGET ROLE: ${targetRole}\n` : ''}
RESUME DATA:
${JSON.stringify(resumeContent, null, 2)}

Provide 3-8 specific, actionable suggestions. For each suggestion, include:
- type: one of [summary, experience, education, skills, projects, certifications, achievements, ats, formatting, general]
- severity: one of [low, medium, high]
- title: short actionable title (max 100 chars)
- message: detailed explanation with specific advice (max 300 chars)
- targetSection: the resume section this applies to

Respond ONLY with a JSON object in this exact format:
{"suggestions": [{"type": "...", "severity": "...", "title": "...", "message": "...", "targetSection": "..."}]}

Focus on:
1. Missing or weak content in important sections
2. ATS keyword optimization
3. Quantified achievements and metrics
4. Action verb usage
5. Section-specific improvements
6. Overall resume structure and completeness

Do NOT suggest design/formatting changes that require UI redesign. Keep suggestions about content quality.`

    const interaction = await generateSuggestions(genAI, prompt)
    const responseText = interaction?.output_text || ''

    // Parse JSON from response (handle markdown code blocks)
    let parsed
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      parsed = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError.message)
      return sendError(res, 'AI returned an unexpected response. Please try again.', 502)
    }

    const suggestions = validateSuggestions(parsed.suggestions)

    // Cache suggestions
    resume.aiSuggestions = {
      suggestions,
      resumeHash: currentHash,
      generatedAt: new Date(),
    }
    await resume.save()

    // Create notification for AI analysis completion
    try {
      await createNotification({
        userId: req.user._id,
        type: 'ai',
        title: 'Resume analysis complete',
        description: `AI generated ${suggestions.length} suggestion${suggestions.length !== 1 ? 's' : ''} to improve your resume.`,
        actionUrl: '/dashboard/resume-builder',
        actionLabel: 'View Suggestions',
      })
    } catch {
      // Notification failure should not break the response
    }

    return sendSuccess(res, {
      suggestions,
      cached: false,
      generatedAt: resume.aiSuggestions.generatedAt,
    })
  } catch (error) {
    const safeMsg = (error.message || '').replace(/key=[^&\s]+/gi, 'key=***')
    console.error('getAISuggestions error:', safeMsg, error.statusCode || error.status)

    if (
      error.message?.includes('API_KEY') ||
      error.statusCode === 404 ||
      error.status === 404 ||
      error.code === 'not_found' ||
      /\b(not found|unsupported model|no longer available)\b/i.test(error.message || '')
    ) {
      return sendError(res, 'The configured AI model is unavailable. Please contact support.', 503)
    }

    const status = error.statusCode || error.status
    const isRateLimit =
      status === 429 ||
      error.code === 'resource_exhausted' ||
      error.code === 'RESOURCE_EXHAUSTED' ||
      error.code === 'rate_limit_exceeded' ||
      /\b(quota|rate limit|too many requests)\b/i.test(error.message || '')

    if (isRateLimit) {
      return sendError(res, 'AI request limit reached. Please wait a minute before trying again.', 429)
    }

    if (status === 502 || status === 503 || status === 504 || /\b(overloaded|temporarily busy|service unavailable)\b/i.test(error.message || '')) {
      return sendError(res, 'AI service is temporarily busy. Please try again in a moment.', 503)
    }

    return sendError(res, 'AI suggestions are temporarily unavailable. Please try again.', 500)
  }
}
