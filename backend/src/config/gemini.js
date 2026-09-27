import { GoogleGenAI } from '@google/genai'

let genAI = null

/**
 * Get the GoogleGenAI instance (lazy singleton).
 * Returns null if GEMINI_API_KEY is not configured.
 */
export function getGeminiClient() {
  if (genAI) return genAI

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set — AI features will be unavailable')
    return null
  }

  genAI = new GoogleGenAI({
    apiKey,
    apiVersion: 'v1',
  })
  return genAI
}

