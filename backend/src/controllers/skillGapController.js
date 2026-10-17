import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import mongoose from 'mongoose'
import multer from 'multer'
import { PDFParse } from 'pdf-parse'
import SkillGapAnalysis from '../models/SkillGapAnalysis.js'
import { getGeminiClient } from '../config/gemini.js'
import { createNotification } from '../services/notificationService.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

/* ── File upload configuration (mirrors ResumeMatch pattern) ─── */

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

export const uploadResumeForSkillGap = multer({
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

/* ── Text extraction (same approach as ATS/ResumeMatch) ─────── */

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

function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch {
    /* noop — temp file cleanup failure is non-critical */
  }
}

/* ── Gemini prompt ──────────────────────────────────────────── */

function buildSkillGapPrompt(targetRole, currentSkillsText, resumeText) {
  const skillsSection = resumeText
    ? `RESUME TEXT (use this to identify the user's current skills accurately):\n${resumeText.slice(0, 6000)}`
    : `USER-PROVIDED CURRENT SKILLS:\n${currentSkillsText.slice(0, 3000)}`

  const additionalSkillsNote =
    resumeText && currentSkillsText
      ? `\nUSER ALSO LISTED THESE SKILLS EXPLICITLY (may supplement the resume):\n${currentSkillsText.slice(0, 1000)}`
      : ''

  return `You are an expert career coach and skills assessment specialist.

Your task is to perform a SKILL GAP ANALYSIS comparing the user's CURRENT demonstrated skills against the requirements for their TARGET ROLE.

TARGET ROLE: ${targetRole}

${skillsSection}${additionalSkillsNote}

CRITICAL RULES — READ CAREFULLY:
1. Only identify skills as MISSING if they are genuinely relevant to the specified TARGET ROLE.
2. Do NOT mark Backend, DevOps, Databases, or other domains as missing if the target role does not require them.
3. A skill is MISSING only if it is demonstrably absent from the provided information AND relevant to the target role.
4. A skill is "needs improvement" if the user has it but likely needs to strengthen it for this specific role.
5. NEVER fabricate skills the user has — only list skills that can be reasonably identified from the provided information.
6. Base the readiness score ONLY on how well the user's evidenced skills match THIS specific target role.
7. Prioritize foundational and role-critical skills before optional or advanced ones.
8. Keep recommendations specific to THIS target role — not generic career advice.
9. Do NOT invent external course URLs. Only provide practical learning steps.
10. Role requirements must reflect what ACTUAL practitioners in that role need — not a wish list.

Respond ONLY with a JSON object in this EXACT format (no markdown, no code blocks, just raw JSON):

{
  "readinessScore": 65,
  "summary": "2-3 sentence assessment of the user's current readiness for this target role based on provided skills.",

  "currentSkills": ["React", "JavaScript", "CSS", "Git"],

  "roleRequirements": ["React", "TypeScript", "State Management", "REST APIs", "Testing", "Version Control"],

  "matchingSkills": ["React", "JavaScript", "Git"],

  "missingSkills": [
    {
      "skill": "TypeScript",
      "reason": "TypeScript is a core requirement for most modern frontend roles and enables type-safe development at scale.",
      "priority": "high",
      "type": "missing",
      "learningSteps": [
        "Learn TypeScript basics: types, interfaces, generics",
        "Convert a JavaScript project to TypeScript",
        "Practice with TypeScript in a React project"
      ],
      "estimatedDuration": "4–6 weeks"
    }
  ],

  "skillsToImprove": [
    {
      "skill": "React",
      "reason": "React is present but deeper knowledge of hooks, performance optimization, and patterns is needed for senior roles.",
      "priority": "medium",
      "type": "improve",
      "learningSteps": [
        "Study advanced React hooks (useReducer, useContext, useMemo)",
        "Learn React performance optimization patterns",
        "Build a complex stateful application"
      ],
      "estimatedDuration": "2–4 weeks"
    }
  ]
}

PRIORITY LEVELS:
- "high": Role-critical skills; the user cannot do this job well without them
- "medium": Important but not immediately blocking; needed for growth
- "low": Nice-to-have; beneficial but not essential to start in the role

Ensure the readinessScore reflects actual role-match:
- 80-100: User has most requirements — a few gaps remain
- 60-79: Solid foundation, moderate gaps to address
- 40-59: Some relevant skills, significant gaps exist
- 0-39: Early stage match — many role requirements are missing`
}

/* ── Response validation ────────────────────────────────────── */

function validateSkillGapResponse(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid skill gap response structure')
  }

  const score = Number(raw.readinessScore)
  if (isNaN(score) || score < 0 || score > 100) {
    throw new Error('Invalid readiness score')
  }

  if (typeof raw.summary !== 'string' || !raw.summary.trim()) {
    throw new Error('Missing skill gap summary')
  }

  const safeStringArray = (arr, max = 50) =>
    Array.isArray(arr) ? arr.filter((k) => typeof k === 'string' && k.trim()).slice(0, max) : []

  const safeSkillItems = (arr, expectedType, max = 20) => {
    if (!Array.isArray(arr)) return []
    return arr
      .filter((item) => item && typeof item === 'object' && typeof item.skill === 'string' && item.skill.trim())
      .slice(0, max)
      .map((item) => ({
        skill: String(item.skill || '').slice(0, 150),
        reason: String(item.reason || '').slice(0, 500),
        priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
        type: item.type === 'improve' ? 'improve' : 'missing',
        learningSteps: safeStringArray(item.learningSteps, 5).map((s) => String(s).slice(0, 300)),
        estimatedDuration: String(item.estimatedDuration || '').slice(0, 100),
      }))
  }

  return {
    readinessScore: Math.round(score),
    summary: String(raw.summary || '').slice(0, 3000),
    currentSkills: safeStringArray(raw.currentSkills, 50),
    roleRequirements: safeStringArray(raw.roleRequirements, 30),
    matchingSkills: safeStringArray(raw.matchingSkills, 30),
    missingSkills: safeSkillItems(raw.missingSkills, 'missing', 20),
    skillsToImprove: safeSkillItems(raw.skillsToImprove, 'improve', 15),
  }
}

/* ── Gemini response extraction (same pattern as ResumeMatch) ── */

function extractTextFromInteraction(interaction) {
  // The Google GenAI generateContent response exposes text as a getter.
  if (typeof interaction?.text === 'string') {
    return interaction.text
  }
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
  return client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      maxOutputTokens: 4096,
      thinkingConfig: { thinkingBudget: 0 },
      httpOptions: { timeout: 45000 },
    },
  })
}

/* ── Shared error handler (mirrors ATS/ResumeMatch pattern) ─── */

function handleSkillGapError(error, res) {
  const safeMsg = (error.message || '').replace(/key=[^\&\s]+/gi, 'key=***')
  console.error('Skill Gap error:', safeMsg, error.statusCode || error.status)

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

  if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.code === 'ETIMEDOUT') {
    return sendError(res, 'AI analysis took too long. Please try again.', 503)
  }

  if (status === 400 || error.code === 'invalid_request') {
    return sendError(res, 'Unable to process this request. Please verify the inputs and try again.', 400)
  }

  return sendError(res, 'Skill gap analysis failed. Please try again.', 500)
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/skill-gap/analyze
   Analyze skill gap — accepts text skills and/or a resume upload.
   ══════════════════════════════════════════════════════════════════ */

export async function analyzeSkillGap(req, res) {
  let filePath = null

  try {
    const targetRole = req.body.targetRole ? req.body.targetRole.trim() : ''
    const currentSkillsInput = req.body.currentSkills ? req.body.currentSkills.trim() : ''
    const file = req.file

    /* Target role is always required */
    if (!targetRole || targetRole.length < 2) {
      return sendError(res, 'Target role is required (minimum 2 characters).', 400)
    }
    if (targetRole.length > 200) {
      return sendError(res, 'Target role exceeds maximum length of 200 characters.', 400)
    }

    /* Must provide either skills text or a resume — or both */
    if (!currentSkillsInput && !file) {
      return sendError(res, 'Please provide your current skills or upload a resume.', 400)
    }

    /* Rate limit: max 10 skill gap analyses per hour per user */
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentCount = await SkillGapAnalysis.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: oneHourAgo },
    })
    if (recentCount >= 10) {
      return sendError(res, 'Analysis limit reached. Please wait before running another analysis.', 429)
    }

    /* Extract resume text if a file was uploaded */
    let resumeText = ''
    let resumeFileName = ''

    if (file) {
      filePath = file.path

      if (!isValidPdf(filePath)) {
        return sendError(res, 'The uploaded file is not a valid PDF.', 400)
      }

      try {
        resumeText = await extractText(filePath, file.mimetype)
      } catch (extractError) {
        console.error('Text extraction error:', extractError.message)
        return sendError(res, 'Failed to extract text from resume. Please ensure the file is not corrupted.', 422)
      }

      if (!resumeText || resumeText.trim().length < 50) {
        return sendError(res, 'Could not extract sufficient text from the resume. The file may be image-based or empty.', 422)
      }

      resumeFileName = file.originalname
    }

    /* Validate current skills text length if provided */
    if (currentSkillsInput && currentSkillsInput.length > 5000) {
      return sendError(res, 'Current skills description exceeds 5,000 characters.', 400)
    }

    /* Call Gemini AI */
    const geminiClient = getGeminiClient()
    if (!geminiClient) {
      return sendError(res, 'AI analysis is temporarily unavailable', 503)
    }

    const prompt = buildSkillGapPrompt(targetRole, currentSkillsInput, resumeText)
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

    const validatedResult = validateSkillGapResponse(parsed)

    /* Store analysis in MongoDB */
    const analysis = await SkillGapAnalysis.create({
      userId: req.user._id,
      targetRole,
      currentSkillsInput,
      resumeFileName,
      ...validatedResult,
      status: 'completed',
    })

    /* Create notification (best-effort) */
    try {
      await createNotification({
        userId: req.user._id,
        type: 'ai',
        title: 'Skill Gap Analysis completed',
        description: `Your skill gap analysis for "${targetRole}" is ready. Readiness score: ${validatedResult.readinessScore}/100.`,
        actionUrl: `/dashboard/skill-gap/${analysis._id.toString()}`,
        actionLabel: 'View Analysis',
        metadata: { analysisId: analysis._id.toString() },
      })
    } catch {
      /* notification failure is non-critical */
    }

    return sendSuccess(res, { analysis: analysis.toJSON() }, 201)
  } catch (error) {
    return handleSkillGapError(error, res)
  } finally {
    cleanupFile(filePath)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/skill-gap/analyses
   Return the authenticated user's Skill Gap analysis history.
   ══════════════════════════════════════════════════════════════════ */

export async function getSkillGapAnalyses(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const skip = (page - 1) * limit

    const [analyses, total] = await Promise.all([
      SkillGapAnalysis.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('targetRole readinessScore summary status createdAt resumeFileName')
        .lean(),
      SkillGapAnalysis.countDocuments({ userId: req.user._id }),
    ])

    const transformed = analyses.map((a) => ({
      id: a._id.toString(),
      targetRole: a.targetRole,
      readinessScore: a.readinessScore,
      summary: a.summary ? a.summary.slice(0, 200) : '',
      status: a.status,
      resumeFileName: a.resumeFileName || '',
      createdAt: a.createdAt,
      date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
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
    console.error('getSkillGapAnalyses error:', error.message)
    return sendError(res, 'Failed to retrieve analyses', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/skill-gap/analyses/:id
   Return a specific analysis only if it belongs to the authenticated user.
   ══════════════════════════════════════════════════════════════════ */

export async function getSkillGapById(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const analysis = await SkillGapAnalysis.findOne({
      _id: id,
      userId: req.user._id,
    })

    if (!analysis) {
      return sendError(res, 'Analysis not found', 404)
    }

    return sendSuccess(res, { analysis: analysis.toJSON() })
  } catch (error) {
    console.error('getSkillGapById error:', error.message)
    return sendError(res, 'Failed to retrieve analysis', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   DELETE /api/skill-gap/analyses/:id
   Delete a specific analysis only if it belongs to the authenticated user.
   ══════════════════════════════════════════════════════════════════ */

export async function deleteSkillGapAnalysis(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid analysis ID', 400)
    }

    const analysis = await SkillGapAnalysis.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    })

    if (!analysis) {
      return sendError(res, 'Analysis not found', 404)
    }

    return sendSuccess(res, { message: 'Analysis deleted' })
  } catch (error) {
    console.error('deleteSkillGapAnalysis error:', error.message)
    return sendError(res, 'Failed to delete analysis', 500)
  }
}
