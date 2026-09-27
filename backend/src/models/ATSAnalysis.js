import mongoose from 'mongoose'

/* ── ATS Analysis schema ─────────────────────────────────────── */

const atsAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    /* ── Input data ──────────────────────────────────────────── */
    resumeFileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    jobDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: 10000,
    },
    analysisMode: {
      type: String,
      enum: ['resume_only', 'job_match'],
      default: 'resume_only',
    },

    /* ── Overall score ───────────────────────────────────────── */
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    /* ── Score breakdown ─────────────────────────────────────── */
    scoreBreakdown: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        score: { type: Number, required: true, min: 0, max: 100 },
        icon: { type: String, default: '' },
        explanation: { type: String, default: '' },
      },
    ],

    /* ── Keywords ─────────────────────────────────────────────── */
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestedKeywords: [{ type: String }],

    /* ── Issues ───────────────────────────────────────────────── */
    issues: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        severity: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
      },
    ],

    /* ── AI Suggestions ──────────────────────────────────────── */
    suggestions: [
      {
        id: { type: String, required: true },
        original: { type: String, default: null },
        replacement: { type: String, default: '' },
        context: { type: String, default: '' },
      },
    ],

    /* ── Compatibility ───────────────────────────────────────── */
    compatibility: {
      compatible: { type: Number, default: 0 },
      needsImprovement: { type: Number, default: 0 },
      critical: { type: Number, default: 0 },
    },

    /* ── Skills coverage ─────────────────────────────────────── */
    skillsCoverage: [
      {
        name: { type: String, required: true },
        current: { type: Number, default: 0 },
        recommended: { type: Number, default: 0 },
      },
    ],

    /* ── Recruiter checklist ─────────────────────────────────── */
    checklist: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        passed: { type: Boolean, default: false },
      },
    ],

    /* ── Resume insights ─────────────────────────────────────── */
    insights: {
      wordCount: { type: Number, default: 0 },
      pageCount: { type: Number, default: 1 },
      readingTime: { type: String, default: '' },
      avgSentenceLength: { type: Number, default: 0 },
      keywordDensity: { type: String, default: '' },
      passiveVoice: { type: String, default: '' },
      numbersUsed: { type: Number, default: 0 },
      actionVerbs: { type: Number, default: 0 },
    },

    /* ── Improvement timeline ────────────────────────────────── */
    timeline: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
        status: { type: String, default: 'pending' },
      },
    ],

    /* ── Analysis summary ────────────────────────────────────── */
    summary: {
      type: String,
      default: '',
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  },
)

/* ── Indexes ─────────────────────────────────────────────────── */

// Primary query: user's analyses sorted by newest first
atsAnalysisSchema.index({ userId: 1, createdAt: -1 })

/* ── JSON transform ──────────────────────────────────────────── */

atsAnalysisSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

const ATSAnalysis = mongoose.model('ATSAnalysis', atsAnalysisSchema)

export default ATSAnalysis
