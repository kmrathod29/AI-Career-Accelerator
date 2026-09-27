import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import mongoose from 'mongoose'
import multer from 'multer'
import { PDFParse } from 'pdf-parse'
import ATSAnalysis from '../models/ATSAnalysis.js'
import { getGeminiClient } from '../config/gemini.js'
import { createNotification } from '../services/notificationService.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

/* ── File upload configuration ─────────────────────────────────── */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const tmpDir = path.join(os.tmpdir(), 'aca-uploads')
    fs.mkdirSync(tmpDir, { recursive: true })
    cb(null, tmpDir)
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

export const uploadResume = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ACCEPTED_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOCX files are supported'))
    }
  },
}).single('resume')

/* ── Text extraction ──────────────────────────────────────────── */

async function extractText(filePath, mimetype) {
  if (mimetype === 'application/pdf') {
    const buffer = fs.readFileSync(filePath)
    const parser = new PDFParse({ data: buffer })

    try {
      const data = await parser.getText()
      return data.text || ''
    } finally {
      await parser.destroy()
    }
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value || ''
  }

  throw new Error('Unsupported file type')
}

/**
 * Clean up temp file (best-effort).
 */
function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch {
    /* noop — temp file cleanup failure is non-critical */
  }
}

/* ── Gemini prompts (Resume-Only vs Job-Match) ────────────────── */

function buildResumeOnlyPrompt(resumeText) {
  return `You are an expert ATS (Applicant Tracking System) analyst and professional resume consultant.
Analyze the following resume purely on its own merits as a standalone professional document (NO job description is provided).
Be honest, accurate, and objective — do NOT invent skills or experiences that the candidate does not have.

RESUME TEXT:
${resumeText.slice(0, 8000)}

Analyze and provide an in-depth resume quality and ATS parseability report.
Evaluate:
1. Overall ATS readability and structure (0-100 overallScore)
2. Format quality, readability, section completeness, grammar, contact info
3. Skills detected directly in the resume (based ONLY on what is evidenced in the resume)
4. Key strengths of the resume
5. Real formatting or content issues that could cause ATS parsing failure
6. Actionable recommendations to improve formatting, impact, and action verb usage
7. Content insights (approximate word count, action verbs, etc.)

CRITICAL RULES FOR RESUME-ONLY MODE:
- There is NO target job description. Do NOT invent a target role or generic full-stack checklist.
- Do NOT output missing keywords or generic missing skills. Return "missingKeywords": [].
- Do NOT generate arbitrary 0% skill gap scores for categories like Backend or Database if absent.
- In "skillsCoverage", list ONLY skills and technologies that ACTUALLY appear in the resume, with a rating/presence of their strength (e.g. current: 85, recommended: 90). Do NOT invent absent categories.
- In "matchedKeywords", list the key detected technical, domain, and soft skills found in the resume.
- In "suggestedKeywords", suggest complementary keywords relevant to the candidate's existing detected domain.
- Do NOT claim the absence of a skill is a deficiency.
- The overallScore should reflect overall resume quality, ATS friendliness, and formatting (0-100).

Respond ONLY with a JSON object in this EXACT format (no markdown, no code blocks, just raw JSON):
{
  "overallScore": 82,
  "analysisMode": "resume_only",
  "scoreBreakdown": [
    {"id": "format", "label": "Format & Layout", "score": 90, "icon": "FileCheck", "explanation": "..."},
    {"id": "readability", "label": "Readability & Flow", "score": 85, "icon": "BookOpen", "explanation": "..."},
    {"id": "sections", "label": "Section Completeness", "score": 80, "icon": "LayoutList", "explanation": "..."},
    {"id": "content", "label": "Content Impact", "score": 75, "icon": "FileText", "explanation": "..."},
    {"id": "grammar", "label": "Grammar & Tone", "score": 95, "icon": "SpellCheck", "explanation": "..."},
    {"id": "contact", "label": "Contact Information", "score": 100, "icon": "Contact", "explanation": "..."},
    {"id": "actionVerbs", "label": "Action Verb Usage", "score": 70, "icon": "Zap", "explanation": "..."}
  ],
  "matchedKeywords": ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git"],
  "missingKeywords": [],
  "suggestedKeywords": ["Next.js", "Performance Optimization"],
  "issues": [
    {"id": "iss-1", "text": "...", "severity": "medium"}
  ],
  "suggestions": [
    {"id": "sug-1", "original": "...", "replacement": "...", "context": "..."}
  ],
  "compatibility": {
    "compatible": 8,
    "needsImprovement": 3,
    "critical": 0
  },
  "skillsCoverage": [
    {"name": "React", "current": 90, "recommended": 95}
  ],
  "checklist": [
    {"id": "chk-1", "label": "Contact Information", "passed": true},
    {"id": "chk-2", "label": "Skills Section", "passed": true},
    {"id": "chk-3", "label": "Experience Section", "passed": true},
    {"id": "chk-4", "label": "Education Section", "passed": true},
    {"id": "chk-5", "label": "One Column Layout", "passed": true},
    {"id": "chk-6", "label": "ATS Friendly Fonts", "passed": true},
    {"id": "chk-7", "label": "Standard Date Format", "passed": true},
    {"id": "chk-8", "label": "Quantified Achievements", "passed": false}
  ],
  "insights": {
    "wordCount": 450,
    "pageCount": 1,
    "readingTime": "2 min",
    "avgSentenceLength": 14,
    "keywordDensity": "3.8%",
    "passiveVoice": "4%",
    "numbersUsed": 6,
    "actionVerbs": 12
  },
  "timeline": [
    {"id": "tl-1", "label": "Strengthen bullet points with metrics", "priority": "high", "status": "pending"}
  ],
  "summary": "Clear 2-3 sentence assessment of the resume structure, strengths, and primary areas for improvement."
}`
}

function buildJobMatchPrompt(resumeText, jobDescription) {
  return `You are an expert ATS (Applicant Tracking System) analyst and career consultant.
Analyze the following resume against the provided job description.
Be honest and accurate — do NOT invent skills or experience that the candidate does not have.

RESUME TEXT:
${resumeText.slice(0, 8000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

Analyze and provide a comprehensive job compatibility and ATS match report.
Evaluate:
1. Overall job compatibility score (0-100)
2. Keyword matching — which required keywords from the JD are present in the resume vs not detected
3. Skills alignment — which skills match vs are not detected in the resume
4. Experience alignment against the job requirements
5. Education alignment against the job requirements
6. Resume formatting/structure quality for ATS parsing
7. Specific issues that would cause ATS rejection for this job
8. Actionable recommendations tailored to this role

CRITICAL RULES:
- Use "Not detected in your resume" for missing skills/keywords. Do NOT claim the user lacks ability; only state what is absent from the resume text.
- Only list keywords that ACTUALLY appear in the JD.
- Do NOT invent candidate skills.
- The overallScore must realistically reflect candidate fit for this specific job (0-100).

Respond ONLY with a JSON object in this EXACT format (no markdown, no code blocks, just raw JSON):
{
  "overallScore": 72,
  "analysisMode": "job_match",
  "scoreBreakdown": [
    {"id": "compatibility", "label": "Job Compatibility", "score": 75, "icon": "Target", "explanation": "..."},
    {"id": "keywords", "label": "Keyword Match", "score": 70, "icon": "Search", "explanation": "..."},
    {"id": "experience", "label": "Experience Alignment", "score": 65, "icon": "Briefcase", "explanation": "..."},
    {"id": "skills", "label": "Skills Alignment", "score": 70, "icon": "Code", "explanation": "..."},
    {"id": "education", "label": "Education Alignment", "score": 85, "icon": "GraduationCap", "explanation": "..."},
    {"id": "format", "label": "Format Score", "score": 85, "icon": "FileCheck", "explanation": "..."},
    {"id": "readability", "label": "Readability", "score": 80, "icon": "BookOpen", "explanation": "..."}
  ],
  "matchedKeywords": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["AWS", "Docker"],
  "suggestedKeywords": ["Cloud Architecture", "Microservices"],
  "issues": [
    {"id": "iss-1", "text": "...", "severity": "high"}
  ],
  "suggestions": [
    {"id": "sug-1", "original": "...", "replacement": "...", "context": "..."}
  ],
  "compatibility": {
    "compatible": 6,
    "needsImprovement": 4,
    "critical": 2
  },
  "skillsCoverage": [
    {"name": "React", "current": 85, "recommended": 90}
  ],
  "checklist": [
    {"id": "chk-1", "label": "Contact Information", "passed": true},
    {"id": "chk-2", "label": "Skills Section", "passed": true},
    {"id": "chk-3", "label": "Education Match", "passed": true},
    {"id": "chk-4", "label": "Experience Match", "passed": true},
    {"id": "chk-5", "label": "ATS Friendly Fonts", "passed": true},
    {"id": "chk-6", "label": "One Column Layout", "passed": true},
    {"id": "chk-7", "label": "Dates Format", "passed": true}
  ],
  "insights": {
    "wordCount": 500,
    "pageCount": 1,
    "readingTime": "2 min",
    "avgSentenceLength": 12,
    "keywordDensity": "4.5%",
    "passiveVoice": "5%",
    "numbersUsed": 8,
    "actionVerbs": 15
  },
  "timeline": [
    {"id": "tl-1", "label": "Address high-priority missing keywords", "priority": "high", "status": "pending"}
  ],
  "summary": "Brief 2-3 sentence summary of job compatibility."
}`
}

/* ── Response validation ──────────────────────────────────────── */

function validateAnalysisResponse(raw, mode = 'resume_only') {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid analysis response structure')
  }

  const score = Number(raw.overallScore)
  if (isNaN(score) || score < 0 || score > 100) {
    throw new Error('Invalid overall score')
  }

  const analysisMode = ['resume_only', 'job_match'].includes(raw.analysisMode)
    ? raw.analysisMode
    : mode

  // In resume_only mode, missing keywords must be strictly empty
  const rawMissing = Array.isArray(raw.missingKeywords) ? raw.missingKeywords : []
  const missingKeywords = analysisMode === 'resume_only'
    ? []
    : rawMissing.filter((k) => typeof k === 'string').slice(0, 30)

  // In resume_only mode, only keep skills that have non-zero presence
  const rawSkills = Array.isArray(raw.skillsCoverage) ? raw.skillsCoverage : []
  const skillsCoverage = rawSkills
    .filter((s) => s && typeof s.name === 'string' && (analysisMode === 'job_match' || (Number(s.current) || 0) > 0))
    .slice(0, 15)
    .map((s) => ({
      name: String(s.name || ''),
      current: Math.max(0, Math.min(100, Math.round(Number(s.current) || 0))),
      recommended: Math.max(0, Math.min(100, Math.round(Number(s.recommended) || 0))),
    }))

  return {
    overallScore: Math.round(score),
    analysisMode,
    scoreBreakdown: Array.isArray(raw.scoreBreakdown)
      ? raw.scoreBreakdown.slice(0, 15).map((s, i) => ({
          id: String(s.id || `score-${i}`),
          label: String(s.label || '').slice(0, 100),
          score: Math.max(0, Math.min(100, Math.round(Number(s.score) || 0))),
          icon: String(s.icon || ''),
          explanation: String(s.explanation || '').slice(0, 300),
        }))
      : [],
    matchedKeywords: Array.isArray(raw.matchedKeywords)
      ? raw.matchedKeywords.filter((k) => typeof k === 'string').slice(0, 30)
      : [],
    missingKeywords,
    suggestedKeywords: Array.isArray(raw.suggestedKeywords)
      ? raw.suggestedKeywords.filter((k) => typeof k === 'string').slice(0, 20)
      : [],
    issues: Array.isArray(raw.issues)
      ? raw.issues.slice(0, 15).map((s, i) => ({
          id: String(s.id || `iss-${i}`),
          text: String(s.text || '').slice(0, 300),
          severity: ['high', 'medium', 'low'].includes(s.severity) ? s.severity : 'medium',
        }))
      : [],
    suggestions: Array.isArray(raw.suggestions)
      ? raw.suggestions.slice(0, 10).map((s, i) => ({
          id: String(s.id || `sug-${i}`),
          original: s.original != null ? String(s.original).slice(0, 200) : null,
          replacement: String(s.replacement || '').slice(0, 200),
          context: String(s.context || '').slice(0, 300),
        }))
      : [],
    compatibility: {
      compatible: Math.max(0, Number(raw.compatibility?.compatible) || 0),
      needsImprovement: Math.max(0, Number(raw.compatibility?.needsImprovement) || 0),
      critical: Math.max(0, Number(raw.compatibility?.critical) || 0),
    },
    skillsCoverage,
    checklist: Array.isArray(raw.checklist)
      ? raw.checklist.slice(0, 15).map((s, i) => ({
          id: String(s.id || `chk-${i}`),
          label: String(s.label || '').slice(0, 100),
          passed: Boolean(s.passed),
        }))
      : [],
    insights: {
      wordCount: Math.max(0, Number(raw.insights?.wordCount) || 0),
      pageCount: Math.max(1, Number(raw.insights?.pageCount) || 1),
      readingTime: String(raw.insights?.readingTime || ''),
      avgSentenceLength: Math.max(0, Number(raw.insights?.avgSentenceLength) || 0),
      keywordDensity: String(raw.insights?.keywordDensity || ''),
      passiveVoice: String(raw.insights?.passiveVoice || ''),
      numbersUsed: Math.max(0, Number(raw.insights?.numbersUsed) || 0),
      actionVerbs: Math.max(0, Number(raw.insights?.actionVerbs) || 0),
    },
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline.slice(0, 10).map((s, i) => ({
          id: String(s.id || `tl-${i}`),
          label: String(s.label || '').slice(0, 200),
          priority: ['high', 'medium', 'low'].includes(s.priority) ? s.priority : 'medium',
          status: String(s.status || 'pending'),
        }))
      : [],
    summary: String(raw.summary || '').slice(0, 2000),
  }
}

/* ── Gemini text extractor & call with retry ──────────────────── */

function extractTextFromInteraction(interaction) {
  if (interaction?.output_text) {
    return interaction.output_text
  }
  if (Array.isArray(interaction?.steps)) {
    const textParts = []
    for (const step of interaction.steps) {
      if (step.type === 'model_output' && Array.isArray(step.content)) {
        for (const item of step.content) {
          if (item.type === 'text' && item.text) {
            textParts.push(item.text)
          }
        }
      }
    }
    if (textParts.length > 0) return textParts.join('')
  }
  return ''
}

async function callGemini(client, prompt) {
  try {
    return await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt,
    })
  } catch (error) {
    const status = error.statusCode || error.status
    // Only retry once on transient server errors (503 Service Unavailable)
    if (status === 503) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return await client.interactions.create({
        model: 'gemini-3.8-flash',
        input: prompt,
      })
    }
    throw error
  }
}

/* ── Shared ATS analysis execution engine ─────────────────────── */

async function executeAtsAnalysis({ file, jobDescription, userId }) {
  const filePath = file.path

  if (jobDescription && jobDescription.length < 20) {
    const err = new Error('Job description is too short. Please provide at least 20 characters or leave it empty for resume-only analysis.')
    err.statusCode = 400
    throw err
  }

  if (jobDescription && jobDescription.length > 10000) {
    const err = new Error('Job description exceeds maximum length of 10,000 characters')
    err.statusCode = 400
    throw err
  }

  const hasJobDescription = Boolean(jobDescription && jobDescription.length >= 20)
  const mode = hasJobDescription ? 'job_match' : 'resume_only'

  /* Rate limit: max 10 analyses per hour per user */
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recentCount = await ATSAnalysis.countDocuments({
    userId,
    createdAt: { $gte: oneHourAgo },
  })
  if (recentCount >= 10) {
    const err = new Error('Analysis limit reached. Please wait before running another analysis.')
    err.statusCode = 429
    throw err
  }

  /* Extract text from resume */
  let resumeText
  try {
    resumeText = await extractText(filePath, file.mimetype)
  } catch (extractError) {
    console.error('Text extraction error:', extractError.message)
    const err = new Error('Failed to extract text from resume. Please ensure the file is not corrupted.')
    err.statusCode = 422
    throw err
  }

  if (!resumeText || resumeText.trim().length < 50) {
    const err = new Error('Could not extract sufficient text from the resume. The file may be image-based or empty.')
    err.statusCode = 422
    throw err
  }

  /* Call Gemini AI via Interactions API */
  const geminiClient = getGeminiClient()
  if (!geminiClient) {
    const err = new Error('AI analysis is temporarily unavailable')
    err.statusCode = 503
    throw err
  }

  const prompt = hasJobDescription
    ? buildJobMatchPrompt(resumeText, jobDescription)
    : buildResumeOnlyPrompt(resumeText)
  const interaction = await callGemini(geminiClient, prompt)
  const responseText = extractTextFromInteraction(interaction)

  if (!responseText) {
    throw new Error('AI returned an empty response')
  }

  /* Parse and validate AI response */
  let parsed
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in AI response')
    parsed = JSON.parse(jsonMatch[0])
  } catch (parseError) {
    console.error('Gemini JSON parse error:', parseError.message)
    const err = new Error('AI returned an unexpected response format. Please try again.')
    err.statusCode = 502
    throw err
  }

  const validatedResult = validateAnalysisResponse(parsed, mode)

  return {
    mode,
    hasJobDescription,
    validatedResult,
  }
}

function handleAtsControllerError(error, res) {
  const safeMsg = (error.message || '').replace(/key=[^&\s]+/gi, 'key=***')
  console.error('ATS analysis error:', safeMsg, error.statusCode || error.status)

  if (error.statusCode && error.statusCode !== 500) {
    return sendError(res, error.message, error.statusCode)
  }

  if (
    error.message?.includes('API_KEY') ||
    error.statusCode === 404 ||
    error.status === 404 ||
    error.code === 'not_found' ||
    /\b(not found|unsupported model)\b/i.test(error.message || '')
  ) {
    return sendError(res, 'AI analysis service is temporarily misconfigured or unavailable.', 503)
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

  if (status === 400 || error.code === 'invalid_request') {
    return sendError(res, 'Unable to process resume with AI. Please check the resume format.', 400)
  }

  return sendError(res, 'ATS analysis failed. Please try again.', 500)
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/ats/analyze — fresh ATS analysis creation
   ══════════════════════════════════════════════════════════════════ */

export async function analyzeResume(req, res) {
  let filePath = null

  try {
    const file = req.file
    if (!file) {
      return sendError(res, 'Resume file is required', 400)
    }

    filePath = file.path
    const jobDescription = req.body.jobDescription ? req.body.jobDescription.trim() : ''

    const { mode, hasJobDescription, validatedResult } = await executeAtsAnalysis({
      file,
      jobDescription,
      userId: req.user._id,
    })

    /* Store analysis in MongoDB */
    const analysis = await ATSAnalysis.create({
      userId: req.user._id,
      resumeFileName: file.originalname,
      jobDescription: hasJobDescription ? jobDescription : '',
      analysisMode: mode,
      ...validatedResult,
      status: 'completed',
    })

    /* Create notification (best-effort) */
    try {
      await createNotification({
        userId: req.user._id,
        type: 'ats',
        title: 'ATS analysis completed',
        description: `Your resume "${file.originalname}" scored ${validatedResult.overallScore}/100.`,
        actionUrl: `/dashboard/ats-analyzer/${analysis._id.toString()}`,
        actionLabel: 'View Report',
        metadata: { analysisId: analysis._id.toString() },
      })
    } catch {
      /* notification failure is non-critical */
    }

    return sendSuccess(res, { analysis: analysis.toJSON() }, 201)
  } catch (error) {
    return handleAtsControllerError(error, res)
  } finally {
    cleanupFile(filePath)
  }
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/ats/analyses/:id/re-analyze — in-place resume re-analysis
   Updates the existing analysis document with newly extracted content.
   ══════════════════════════════════════════════════════════════════ */

export async function reAnalyzeResume(req, res) {
  let filePath = null

  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const existing = await ATSAnalysis.findOne({
      _id: id,
      userId: req.user._id,
    })

    if (!existing) {
      return sendError(res, 'Analysis not found', 404)
    }

    const file = req.file
    if (!file) {
      return sendError(res, 'Updated resume file is required for re-analysis', 400)
    }

    filePath = file.path

    // Use passed job description if provided; otherwise keep existing
    const jobDescription =
      req.body.jobDescription !== undefined && req.body.jobDescription !== null && req.body.jobDescription.trim() !== ''
        ? req.body.jobDescription.trim()
        : (existing.jobDescription || '')

    const { mode, hasJobDescription, validatedResult } = await executeAtsAnalysis({
      file,
      jobDescription,
      userId: req.user._id,
    })

    // Update the existing document in place to maintain the same analysis ID and route
    existing.resumeFileName = file.originalname
    existing.jobDescription = hasJobDescription ? jobDescription : ''
    existing.analysisMode = mode
    existing.overallScore = validatedResult.overallScore
    existing.scoreBreakdown = validatedResult.scoreBreakdown
    existing.matchedKeywords = validatedResult.matchedKeywords
    existing.missingKeywords = validatedResult.missingKeywords
    existing.suggestedKeywords = validatedResult.suggestedKeywords
    existing.issues = validatedResult.issues
    existing.suggestions = validatedResult.suggestions
    existing.compatibility = validatedResult.compatibility
    existing.skillsCoverage = validatedResult.skillsCoverage
    existing.checklist = validatedResult.checklist
    existing.insights = validatedResult.insights
    existing.timeline = validatedResult.timeline
    existing.summary = validatedResult.summary
    existing.status = 'completed'

    await existing.save()

    /* Create notification (best-effort) */
    try {
      await createNotification({
        userId: req.user._id,
        type: 'ats',
        title: 'ATS analysis updated',
        description: `Your updated resume "${file.originalname}" scored ${validatedResult.overallScore}/100.`,
        actionUrl: `/dashboard/ats-analyzer/${existing._id.toString()}`,
        actionLabel: 'View Report',
        metadata: { analysisId: existing._id.toString() },
      })
    } catch {
      /* notification failure is non-critical */
    }

    return sendSuccess(res, { analysis: existing.toJSON() }, 200)
  } catch (error) {
    return handleAtsControllerError(error, res)
  } finally {
    cleanupFile(filePath)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/ats/analyses
   Return the authenticated user's analysis history.
   ══════════════════════════════════════════════════════════════════ */

export async function getAnalyses(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const skip = (page - 1) * limit

    const [analyses, total] = await Promise.all([
      ATSAnalysis.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ATSAnalysis.countDocuments({ userId: req.user._id }),
    ])

    const transformed = analyses.map((a) => ({
      id: a._id.toString(),
      fileName: a.resumeFileName,
      date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
      score: a.overallScore,
      status: a.status,
      analysisMode: a.analysisMode || (a.jobDescription ? 'job_match' : 'resume_only'),
      jobTitle: a.jobDescription ? a.jobDescription.slice(0, 60).replace(/\n/g, ' ') : null,
      createdAt: a.createdAt,
    }))

    return sendSuccess(res, {
      analyses: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (error) {
    console.error('getAnalyses error:', error.message)
    return sendError(res, 'Failed to retrieve analyses', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/ats/analyses/:id
   Return a specific analysis only if it belongs to the authenticated user.
   ══════════════════════════════════════════════════════════════════ */

export async function getAnalysisById(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const analysis = await ATSAnalysis.findOne({
      _id: id,
      userId: req.user._id,
    })

    if (!analysis) {
      return sendError(res, 'Analysis not found', 404)
    }

    return sendSuccess(res, { analysis: analysis.toJSON() })
  } catch (error) {
    console.error('getAnalysisById error:', error.message)
    return sendError(res, 'Failed to retrieve analysis', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   DELETE /api/ats/analyses/:id
   Delete a specific analysis only if it belongs to the authenticated user.
   ══════════════════════════════════════════════════════════════════ */

export async function deleteAnalysis(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const analysis = await ATSAnalysis.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    })

    if (!analysis) {
      return sendError(res, 'Analysis not found', 404)
    }

    return sendSuccess(res, { message: 'Analysis deleted' })
  } catch (error) {
    console.error('deleteAnalysis error:', error.message)
    return sendError(res, 'Failed to delete analysis', 500)
  }
}
