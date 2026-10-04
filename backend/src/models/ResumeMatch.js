import mongoose from 'mongoose'

/* ── Resume Match Analysis schema ────────────────────────────── */

const resumeMatchSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
      maxlength: 10000,
    },
    jobTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },

    /* ── Overall match score ─────────────────────────────────── */
    overallMatchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    /* ── Summary ─────────────────────────────────────────────── */
    summary: {
      type: String,
      default: '',
      maxlength: 3000,
    },

    /* ── Skills ──────────────────────────────────────────────── */
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],

    /* ── Keywords ────────────────────────────────────────────── */
    matchingKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],

    /* ── Experience match ────────────────────────────────────── */
    experienceMatch: {
      score: { type: Number, default: null, min: 0, max: 100 },
      analysis: { type: String, default: '' },
    },

    /* ── Education match ─────────────────────────────────────── */
    educationMatch: {
      score: { type: Number, default: null, min: 0, max: 100 },
      analysis: { type: String, default: '' },
    },

    /* ── Strengths, gaps, recommendations ────────────────────── */
    strengths: [{ type: String }],
    gaps: [{ type: String }],
    recommendations: [{ type: String }],

    /* ── Status ──────────────────────────────────────────────── */
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
resumeMatchSchema.index({ userId: 1, createdAt: -1 })

/* ── JSON transform ──────────────────────────────────────────── */

resumeMatchSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

const ResumeMatch = mongoose.model('ResumeMatch', resumeMatchSchema)

export default ResumeMatch
