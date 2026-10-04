import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import mongoose from 'mongoose'
import multer from 'multer'
import { PDFParse } from 'pdf-parse'
import ResumeMatch from '../models/ResumeMatch.js'
import { getGeminiClient } from '../config/gemini.js'
import { createNotification } from '../services/notificationService.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

/* ── File upload configuration (mirrors ATS pattern) ─────────── */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_MIMES = ['application/pdf']

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
      cb(new Error('Only PDF files are supported'))
    }
  },
}).single('resume')

/* ── Text extraction (same approach as ATS) ──────────────────── */

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

  throw new Error('Unsupported file type')
}

function isValidPdf(filePath) {
  const header = Buffer.alloc(5)
  const descriptor = fs.openSync(filePath, 'r')
  try {
    fs.readSync(descriptor, header, 0, header.length, 0)
    return header.toString('ascii') === '%PDF-'
  } finally {
    fs.closeSync(descriptor)
  }
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

/* ── Gemini prompt for Resume Match ──────────────────────────── */

function buildResumeMatchPrompt(resumeText, jobDescription) {
  return `You are an expert career consultant and resume-to-job-description matching specialist.
Your task is to analyze how well the provided RESUME matches the provided JOB DESCRIPTION.

CRITICAL: This is NOT an ATS compatibility check. This is a targeted comparison of a specific resume against a specific job description.
Only evaluate criteria that are actually present in the job description.
Do NOT penalize the candidate for skills or qualifications NOT mentioned in the job description.
Do NOT invent requirements that are not in the JD.
Be honest and accurate — do NOT fabricate skills the candidate does not demonstrate.

RESUME TEXT:
${resumeText.slice(0, 8000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 5000)}

Analyze and compare, then respond ONLY with a JSON object in this EXACT format (no markdown, no code blocks, just raw JSON):

{
  "overallMatchScore": 75,
  "summary": "2-3 sentence summary of how well this resume matches this specific job description.",
  "jobTitle": "Extracted or inferred job title from the JD (e.g., 'Frontend Developer')",

  "matchingSkills": ["React", "JavaScript", "Git"],
  "missingSkills": ["TypeScript", "Next.js"],

  "matchingKeywords": ["React", "JavaScript", "REST API", "Agile"],
  "missingKeywords": ["TypeScript", "GraphQL"],

  "experienceMatch": {
    "score": 70,
    "analysis": "Analysis of how the candidate's experience aligns with the JD requirements. If the JD does not specify experience requirements, set score to null and state that no specific experience requirement was mentioned."
  },

  "educationMatch": {
    "score": 85,
    "analysis": "Analysis of how the candidate's education aligns with the JD requirements. If the JD does not specify education requirements, set score to null and state that no specific education requirement was mentioned."
  },

  "strengths": [
    "Strong match in core frontend skills (React, JavaScript)",
    "Relevant project experience with similar technology stack"
  ],
  "gaps": [
    "Missing TypeScript experience required by the role",
    "No demonstrated experience with Next.js"
  ],
  "recommendations": [
    "Add TypeScript projects to your portfolio",
    "Highlight any experience with server-side rendering frameworks",
    "Tailor your resume summary to emphasize frontend development focus"
  ]
}

CRITICAL RULES:
1. overallMatchScore must reflect compatibility with THIS SPECIFIC JD (0-100).
2. matchingSkills: Skills found in BOTH resume AND JD.
3. missingSkills: Skills required/preferred in JD but NOT sufficiently demonstrated in resume.
4. matchingKeywords: Important JD keywords/terms found in the resume. Focus on technical skills, tools, frameworks, certifications, methodologies, domain terms.
5. missingKeywords: Important JD keywords/terms NOT found in the resume.
6. experienceMatch.score: Set to null if the JD does not specify experience requirements.
7. educationMatch.score: Set to null if the JD does not specify education requirements.
8. Do NOT treat every common word as a keyword. Focus on meaningful professional terms.
9. Do NOT invent missing skills unrelated to the JD.
10. strengths, gaps, and recommendations must be specific to this resume-JD pair.
11. jobTitle: Extract the job title from the JD if possible, or infer it. Use empty string if unclear.`
}

/* ── Response validation ─────────────────────────────────────── */

function validateResumeMatchResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid resume match response structure')
  }

  const score = Number(raw.overallMatchScore)
  if (isNaN(score) || score < 0 || score > 100) {
    throw new Error('Invalid overall match score')
  }

  if (typeof raw.summary !== 'string' || !raw.summary.trim()) {
    throw new Error('Missing resume match summary')
  }

  const safeStringArray = (arr, max = 30) =>
    Array.isArray(arr) ? arr.filter((k) => typeof k === 'string' && k.trim()).slice(0, max) : []

  const normalizeOptionalScore = (value, fieldName) => {
    if (value === null || value === undefined) return null
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) {
      throw new Error(`Invalid ${fieldName} score`)
    }
    return Math.round(numeric)
  }

  return {
    overallMatchScore: Math.round(score),
    summary: String(raw.summary || '').slice(0, 3000),
    jobTitle: String(raw.jobTitle || '').slice(0, 200),

    matchingSkills: safeStringArray(raw.matchingSkills, 30),
    missingSkills: safeStringArray(raw.missingSkills, 30),

    matchingKeywords: safeStringArray(raw.matchingKeywords, 30),
    missingKeywords: safeStringArray(raw.missingKeywords, 30),

    experienceMatch: {
      score: normalizeOptionalScore(raw.experienceMatch?.score, 'experience match'),
      analysis: String(raw.experienceMatch?.analysis || '').slice(0, 1000),
    },

    educationMatch: {
      score: normalizeOptionalScore(raw.educationMatch?.score, 'education match'),
      analysis: String(raw.educationMatch?.analysis || '').slice(0, 1000),
    },

    strengths: safeStringArray(raw.strengths, 10),
    gaps: safeStringArray(raw.gaps, 10),
    recommendations: safeStringArray(raw.recommendations, 10),
  }
}

/* ── Gemini text extractor & call with retry (same as ATS) ───── */

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

/* ── Shared error handler (mirrors ATS pattern) ──────────────── */

function handleResumeMatchError(error, res) {
  const safeMsg = (error.message || '').replace(/key=[^&\s]+/gi, 'key=***')
  console.error('Resume Match error:', safeMsg, error.statusCode || error.status)

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

  // Do not forward provider messages: they can be noisy or contain implementation details.
  if (status >= 400 && status < 500) {
    return sendError(res, 'Unable to process this resume match request. Please verify the inputs and try again.', 400)
  }

  if (status === 502 || status === 503 || status === 504 || /\b(overloaded|temporarily busy|service unavailable)\b/i.test(error.message || '')) {
    return sendError(res, 'AI service is temporarily busy. Please try again in a moment.', 503)
  }

  if (status === 400 || error.code === 'invalid_request') {
    return sendError(res, 'Unable to process resume with AI. Please check the resume format.', 400)
  }

  return sendError(res, 'Resume match analysis failed. Please try again.', 500)
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/resume-match/analyze — fresh Resume Match analysis
   ══════════════════════════════════════════════════════════════════ */

export async function analyzeResumeMatch(req, res) {
  let filePath = null

  try {
    const file = req.file
    if (!file) {
      return sendError(res, 'Resume file is required', 400)
    }

    filePath = file.path
    if (!isValidPdf(filePath)) {
      return sendError(res, 'The uploaded file is not a valid PDF.', 400)
    }
    const jobDescription = req.body.jobDescription ? req.body.jobDescription.trim() : ''

    /* Job description is REQUIRED for Resume Match */
    if (!jobDescription || jobDescription.length < 20) {
      return sendError(res, 'Job description is required and must be at least 20 characters.', 400)
    }

    if (jobDescription.length > 10000) {
      return sendError(res, 'Job description exceeds maximum length of 10,000 characters', 400)
    }

    /* Rate limit: max 10 analyses per hour per user */
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentCount = await ResumeMatch.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: oneHourAgo },
    })
    if (recentCount >= 10) {
      return sendError(res, 'Analysis limit reached. Please wait before running another analysis.', 429)
    }

    /* Extract text from resume */
    let resumeText
    try {
      resumeText = await extractText(filePath, file.mimetype)
    } catch (extractError) {
      console.error('Text extraction error:', extractError.message)
      return sendError(res, 'Failed to extract text from resume. Please ensure the file is not corrupted.', 422)
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return sendError(res, 'Could not extract sufficient text from the resume. The file may be image-based or empty.', 422)
    }

    /* Call Gemini AI */
    const geminiClient = getGeminiClient()
    if (!geminiClient) {
      return sendError(res, 'AI analysis is temporarily unavailable', 503)
    }

    const prompt = buildResumeMatchPrompt(resumeText, jobDescription)
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
      return sendError(res, 'AI returned an unexpected response format. Please try again.', 502)
    }

    const validatedResult = validateResumeMatchResponse(parsed)

    /* Store analysis in MongoDB */
    const analysis = await ResumeMatch.create({
      userId: req.user._id,
      resumeFileName: file.originalname,
      jobDescription,
      jobTitle: validatedResult.jobTitle,
      ...validatedResult,
      status: 'completed',
    })

    /* Create notification (best-effort) */
    try {
      await createNotification({
        userId: req.user._id,
        type: 'resume_match',
        title: 'Resume Match completed',
        description: `Your resume "${file.originalname}" scored ${validatedResult.overallMatchScore}/100 match.`,
        actionUrl: `/dashboard/resume-match/${analysis._id.toString()}`,
        actionLabel: 'View Report',
        metadata: { analysisId: analysis._id.toString() },
      })
    } catch {
      /* notification failure is non-critical */
    }

    return sendSuccess(res, { analysis: analysis.toJSON() }, 201)
  } catch (error) {
    return handleResumeMatchError(error, res)
  } finally {
    cleanupFile(filePath)
  }
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/resume-match/analyses/:id/re-analyze
   Re-analyze with a new PDF, reusing existing JD.
   ══════════════════════════════════════════════════════════════════ */

export async function reAnalyzeResumeMatch(req, res) {
  let filePath = null

  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const existing = await ResumeMatch.findOne({
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
    if (!isValidPdf(filePath)) {
      return sendError(res, 'The uploaded file is not a valid PDF.', 400)
    }

    // Use passed job description if provided; otherwise keep existing
    const jobDescription =
      req.body.jobDescription !== undefined && req.body.jobDescription !== null && req.body.jobDescription.trim() !== ''
        ? req.body.jobDescription.trim()
        : existing.jobDescription

    if (!jobDescription || jobDescription.length < 20) {
      return sendError(res, 'Job description is required and must be at least 20 characters.', 400)
    }

    /* Rate limit */
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentCount = await ResumeMatch.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: oneHourAgo },
    })
    if (recentCount >= 10) {
      return sendError(res, 'Analysis limit reached. Please wait before running another analysis.', 429)
    }

    /* Extract text */
    let resumeText
    try {
      resumeText = await extractText(filePath, file.mimetype)
    } catch (extractError) {
      console.error('Text extraction error:', extractError.message)
      return sendError(res, 'Failed to extract text from resume. Please ensure the file is not corrupted.', 422)
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return sendError(res, 'Could not extract sufficient text from the resume. The file may be image-based or empty.', 422)
    }

    /* Call Gemini AI */
    const geminiClient = getGeminiClient()
    if (!geminiClient) {
      return sendError(res, 'AI analysis is temporarily unavailable', 503)
    }

    const prompt = buildResumeMatchPrompt(resumeText, jobDescription)
    const interaction = await callGemini(geminiClient, prompt)
    const responseText = extractTextFromInteraction(interaction)

    if (!responseText) {
      throw new Error('AI returned an empty response')
    }

    let parsed
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in AI response')
      parsed = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError.message)
      return sendError(res, 'AI returned an unexpected response format. Please try again.', 502)
    }

    const validatedResult = validateResumeMatchResponse(parsed)

    // Update the existing document in place
    existing.resumeFileName = file.originalname
    existing.jobDescription = jobDescription
    existing.jobTitle = validatedResult.jobTitle
    existing.overallMatchScore = validatedResult.overallMatchScore
    existing.summary = validatedResult.summary
    existing.matchingSkills = validatedResult.matchingSkills
    existing.missingSkills = validatedResult.missingSkills
    existing.matchingKeywords = validatedResult.matchingKeywords
    existing.missingKeywords = validatedResult.missingKeywords
    existing.experienceMatch = validatedResult.experienceMatch
    existing.educationMatch = validatedResult.educationMatch
    existing.strengths = validatedResult.strengths
    existing.gaps = validatedResult.gaps
    existing.recommendations = validatedResult.recommendations
    existing.status = 'completed'

    await existing.save()

    /* Create notification (best-effort) */
    try {
      await createNotification({
        userId: req.user._id,
        type: 'resume_match',
        title: 'Resume Match updated',
        description: `Your updated resume "${file.originalname}" scored ${validatedResult.overallMatchScore}/100 match.`,
        actionUrl: `/dashboard/resume-match/${existing._id.toString()}`,
        actionLabel: 'View Report',
        metadata: { analysisId: existing._id.toString() },
      })
    } catch {
      /* notification failure is non-critical */
    }

    return sendSuccess(res, { analysis: existing.toJSON() }, 200)
  } catch (error) {
    return handleResumeMatchError(error, res)
  } finally {
    cleanupFile(filePath)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/resume-match/analyses
   Return the authenticated user's Resume Match history.
   ══════════════════════════════════════════════════════════════════ */

export async function getResumeMatchAnalyses(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const skip = (page - 1) * limit

    const [analyses, total] = await Promise.all([
      ResumeMatch.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ResumeMatch.countDocuments({ userId: req.user._id }),
    ])

    const transformed = analyses.map((a) => ({
      id: a._id.toString(),
      fileName: a.resumeFileName,
      date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
      score: a.overallMatchScore,
      status: a.status,
      jobTitle: a.jobTitle || a.jobDescription?.slice(0, 60).replace(/\n/g, ' ') || '',
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
    console.error('getResumeMatchAnalyses error:', error.message)
    return sendError(res, 'Failed to retrieve analyses', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/resume-match/analyses/:id
   Return a specific analysis only if it belongs to the authenticated user.
   ══════════════════════════════════════════════════════════════════ */

export async function getResumeMatchById(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const analysis = await ResumeMatch.findOne({
      _id: id,
      userId: req.user._id,
    })

    if (!analysis) {
      return sendError(res, 'Analysis not found', 404)
    }

    return sendSuccess(res, { analysis: analysis.toJSON() })
  } catch (error) {
    console.error('getResumeMatchById error:', error.message)
    return sendError(res, 'Failed to retrieve analysis', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   DELETE /api/resume-match/analyses/:id
   Delete a specific analysis only if it belongs to the authenticated user.
   ══════════════════════════════════════════════════════════════════ */

export async function deleteResumeMatch(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const analysis = await ResumeMatch.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    })

    if (!analysis) {
      return sendError(res, 'Analysis not found', 404)
    }

    return sendSuccess(res, { message: 'Analysis deleted' })
  } catch (error) {
    console.error('deleteResumeMatch error:', error.message)
    return sendError(res, 'Failed to delete analysis', 500)
  }
}
