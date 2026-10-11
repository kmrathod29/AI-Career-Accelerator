import mongoose from 'mongoose'
import CoachConversation from '../models/CoachConversation.js'
import { getGeminiClient } from '../config/gemini.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

/* ── Constants ────────────────────────────────────────────────── */

const MAX_MESSAGE_LENGTH = 4000
const MAX_HISTORY_MESSAGES = 20  // Context window for Gemini (most recent N messages)
const MAX_CONVERSATIONS_PER_LIST = 30
const inFlightRequestIds = new Set()

/* ── Career coach system prompt ───────────────────────────────── */

function buildSystemPrompt(user) {
  const career = user?.career ?? {}
  const profile = user?.profile ?? {}

  const contextParts = []

  if (career.currentRole) contextParts.push(`Current role: ${career.currentRole}`)
  if (career.experienceLevel) contextParts.push(`Experience level: ${career.experienceLevel}`)
  if (career.skills?.length) contextParts.push(`Skills: ${career.skills.slice(0, 15).join(', ')}`)
  if (career.preferredRole) contextParts.push(`Target role: ${career.preferredRole}`)
  if (career.education) contextParts.push(`Education: ${career.education}`)
  if (career.degree && career.branch) contextParts.push(`Degree: ${career.degree} in ${career.branch}`)
  if (career.preferredLocation) contextParts.push(`Preferred location: ${career.preferredLocation}`)
  if (profile.bio) contextParts.push(`Bio: ${profile.bio.slice(0, 200)}`)

  const userContext = contextParts.length
    ? `\n\nUSER PROFILE (use where genuinely relevant — do not force it into every answer):\n${contextParts.join('\n')}`
    : ''

  return `You are an expert AI Career Coach for the AI Career Accelerator platform.
Your role is to provide practical, personalised career guidance.

AREAS OF EXPERTISE:
- Career direction, role selection, and career transitions
- Skill development and learning paths
- Interview preparation (technical, behavioural, system design)
- Resume and job-search strategy
- Portfolio and project recommendations
- Professional growth, networking, and salary negotiation
- Career planning and goal setting
${userContext}

BEHAVIOUR GUIDELINES:
- Be concise, direct, and actionable. Avoid padding.
- Use formatting (bullet points, numbered lists, bold text in markdown) when it improves clarity.
- Ask a focused clarifying question when the user's request is ambiguous.
- Clearly communicate when you lack sufficient information to give a specific answer.
- Do NOT invent resume details, qualifications, or work history you were not told about.
- Do NOT claim to have read or analysed a resume unless the user has shared its content in this conversation.
- Do NOT assist with off-topic requests unrelated to career development.
- If asked who you are, say you are an AI Career Coach built into the AI Career Accelerator platform.

Keep responses focused and helpful. Prioritise quality over length.`
}

/* ── Gemini call helper ───────────────────────────────────────── */

async function callGemini(systemPrompt, conversationMessages) {
  const genAI = getGeminiClient()
  if (!genAI) {
    throw new Error('AI service is not available. Please try again later.')
  }

  const history = conversationMessages
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Career Coach'}: ${msg.content}`)
    .join('\n\n')
  const input = `${systemPrompt}\n\nConversation so far:\n${history}\n\nCareer Coach:`

  async function createInteraction() {
    return genAI.interactions.create({ model: 'gemini-3.8-flash', input })
  }

  let response
  try {
    response = await createInteraction()
  } catch (error) {
    const status = error.statusCode || error.status
    if (status !== 503) throw error
    await new Promise((resolve) => setTimeout(resolve, 1000))
    response = await createInteraction()
  }

  const text = response?.output_text
    || response?.steps
      ?.filter((step) => step.type === 'model_output' && Array.isArray(step.content))
      .flatMap((step) => step.content)
      .filter((item) => item.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text)
      .join('')
    || ''
  if (!text.trim()) {
    throw new Error('The AI returned an empty response. Please try again.')
  }
  return text.trim()
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/coach/conversations
   List user's conversations (newest first, excluding deleted).
   ══════════════════════════════════════════════════════════════════ */

export async function getConversations(req, res) {
  try {
    const userId = req.user._id

    const conversations = await CoachConversation.find({
      userId,
      deletedAt: null,
    })
      .sort({ updatedAt: -1 })
      .limit(MAX_CONVERSATIONS_PER_LIST)
      .select('title createdAt updatedAt')
      .lean()

    const data = conversations.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))

    return sendSuccess(res, { conversations: data })
  } catch (error) {
    console.error('getConversations error:', error.message)
    return sendError(res, 'Failed to load conversations', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/coach/conversations
   Create a new empty conversation.
   ══════════════════════════════════════════════════════════════════ */

export async function createConversation(req, res) {
  try {
    const userId = req.user._id

    const conversation = await CoachConversation.create({
      userId,
      title: 'New Conversation',
      messages: [],
    })

    return sendSuccess(
      res,
      {
        conversation: {
          id: conversation._id.toString(),
          title: conversation.title,
          messages: [],
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        },
      },
      201,
    )
  } catch (error) {
    console.error('createConversation error:', error.message)
    return sendError(res, 'Failed to create conversation', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   GET /api/coach/conversations/:id
   Load a conversation (messages included).
   ══════════════════════════════════════════════════════════════════ */

export async function getConversation(req, res) {
  try {
    const userId = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Conversation not found', 404)
    }

    const conversation = await CoachConversation.findOne({
      _id: id,
      userId,
      deletedAt: null,
    }).lean()

    if (!conversation) {
      return sendError(res, 'Conversation not found', 404)
    }

    return sendSuccess(res, {
      conversation: {
        id: conversation._id.toString(),
        title: conversation.title,
        messages: conversation.messages.map((m) => ({
          id: m._id.toString(),
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    })
  } catch (error) {
    console.error('getConversation error:', error.message)
    return sendError(res, 'Failed to load conversation', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   POST /api/coach/conversations/:id/messages
   Send a message in an existing conversation and get an AI reply.
   ══════════════════════════════════════════════════════════════════ */

export async function sendMessage(req, res) {
  try {
    const userId = req.user._id
    const { id } = req.params
    const { message, requestId } = req.body

    /* ── Input validation ── */
    if (!message || typeof message !== 'string') {
      return sendError(res, 'Message is required', 400)
    }
    const trimmed = message.trim()
    if (!trimmed) {
      return sendError(res, 'Message cannot be empty', 400)
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return sendError(res, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`, 400)
    }
    if (requestId !== undefined && (typeof requestId !== 'string' || !/^[\w-]{8,100}$/.test(requestId))) {
      return sendError(res, 'Invalid request ID', 400)
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Conversation not found', 404)
    }

    /* ── Load conversation (ownership check) ── */
    const conversation = await CoachConversation.findOne({
      _id: id,
      userId,
      deletedAt: null,
    })

    if (!conversation) {
      return sendError(res, 'Conversation not found', 404)
    }

    // Return a completed turn if the client is retrying after losing its response.
    if (requestId) {
      const existingIndex = conversation.messages.findIndex((item) => item.requestId === requestId)
      if (existingIndex >= 0) {
        const userMsg = conversation.messages[existingIndex]
        const assistantMsg = conversation.messages[existingIndex + 1]
        if (!assistantMsg || assistantMsg.role !== 'assistant') {
          return sendError(res, 'This message is still being processed. Please retry shortly.', 409)
        }
        return sendSuccess(res, {
          userMessage: {
            id: userMsg._id.toString(),
            role: 'user',
            content: userMsg.content,
            createdAt: userMsg.createdAt,
          },
          assistantMessage: {
            id: assistantMsg._id.toString(),
            role: 'assistant',
            content: assistantMsg.content,
            createdAt: assistantMsg.createdAt,
          },
          conversationTitle: conversation.title,
        })
      }
    }

    const requestKey = requestId ? `${conversation._id.toString()}:${requestId}` : null
    if (requestKey && inFlightRequestIds.has(requestKey)) {
      return sendError(res, 'This message is still being processed. Please retry shortly.', 409)
    }
    if (requestKey) inFlightRequestIds.add(requestKey)

    try {
      /* ── Append user message ── */
      conversation.messages.push({ role: 'user', content: trimmed, ...(requestId ? { requestId } : {}) })

    /* ── Build history window for Gemini ── */
    const historyWindow = conversation.messages.slice(-MAX_HISTORY_MESSAGES)

    /* ── Call Gemini ── */
    const systemPrompt = buildSystemPrompt(req.user)
    let assistantText
    try {
      assistantText = await callGemini(systemPrompt, historyWindow)
    } catch (aiError) {
      const safeMessage = String(aiError?.message || 'Unknown Gemini error').replace(/key=[^&\s]+/gi, 'key=***')
      console.error('Gemini error:', safeMessage, aiError?.statusCode || aiError?.status || '')
      // Remove the user message we just added (don't persist a failed turn)
      conversation.messages.pop()
      return sendError(res, 'The AI coach is temporarily unavailable. Please try again shortly.', 503)
    }

    /* ── Append assistant reply ── */
    conversation.messages.push({ role: 'assistant', content: assistantText })

    /* ── Auto-title on first user message ── */
    if (conversation.messages.length === 2 && conversation.title === 'New Conversation') {
      const rawTitle = trimmed.slice(0, 60)
      conversation.title = rawTitle.length < trimmed.length ? `${rawTitle}…` : rawTitle
    }

    await conversation.save()

    /* ── Return the two new messages ── */
    const msgs = conversation.messages
    const userMsg = msgs[msgs.length - 2]
    const assistantMsg = msgs[msgs.length - 1]

      return sendSuccess(res, {
        userMessage: {
          id: userMsg._id.toString(),
          role: 'user',
          content: userMsg.content,
          createdAt: userMsg.createdAt,
        },
        assistantMessage: {
          id: assistantMsg._id.toString(),
          role: 'assistant',
          content: assistantMsg.content,
          createdAt: assistantMsg.createdAt,
        },
        conversationTitle: conversation.title,
      })
    } finally {
      if (requestKey) inFlightRequestIds.delete(requestKey)
    }
  } catch (error) {
    console.error('sendMessage error:', error.message)
    return sendError(res, 'Failed to process message', 500)
  }
}

/* ══════════════════════════════════════════════════════════════════
   DELETE /api/coach/conversations/:id
   Soft-delete a conversation.
   ══════════════════════════════════════════════════════════════════ */

export async function deleteConversation(req, res) {
  try {
    const userId = req.user._id
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Conversation not found', 404)
    }

    const conversation = await CoachConversation.findOne({
      _id: id,
      userId,
      deletedAt: null,
    })

    if (!conversation) {
      return sendError(res, 'Conversation not found', 404)
    }

    conversation.deletedAt = new Date()
    await conversation.save()

    return sendSuccess(res, { deleted: true })
  } catch (error) {
    console.error('deleteConversation error:', error.message)
    return sendError(res, 'Failed to delete conversation', 500)
  }
}
