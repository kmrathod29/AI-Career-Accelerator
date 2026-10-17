import mongoose from 'mongoose'

/* ── Skill Gap Analysis schema ────────────────────────────────── */

const skillItemSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true, trim: true, maxlength: 150 },
    reason: { type: String, default: '', maxlength: 500 },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    learningSteps: [{ type: String, maxlength: 300 }],
    estimatedDuration: { type: String, default: '', maxlength: 100 },
    type: { type: String, enum: ['missing', 'improve'], default: 'missing' },
  },
  { _id: false },
)

const skillGapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    /* ── Input data ────────────────────────────────────────────── */
    targetRole: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    currentSkillsInput: {
      // Free-text skills provided by the user directly
      type: String,
      default: '',
      maxlength: 5000,
    },
    resumeFileName: {
      // If resume was uploaded for skill extraction
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },

    /* ── Analysis results ──────────────────────────────────────── */
    summary: {
      type: String,
      default: '',
      maxlength: 3000,
    },

    // Skills extracted/identified from the user's current knowledge
    currentSkills: [{ type: String, maxlength: 150 }],

    // Skills that match the target role requirements
    matchingSkills: [{ type: String, maxlength: 150 }],

    // Skills missing for the target role (with context)
    missingSkills: [skillItemSchema],

    // Skills the user has but needs to improve for this role
    skillsToImprove: [skillItemSchema],

    // Role-relevant skills the AI identified as required
    roleRequirements: [{ type: String, maxlength: 150 }],

    // Overall readiness score (0-100) for the target role
    readinessScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    /* ── Status ────────────────────────────────────────────────── */
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

/* ── Indexes ──────────────────────────────────────────────────── */

// Primary query: user's analyses sorted by newest first
skillGapSchema.index({ userId: 1, createdAt: -1 })

/* ── JSON transform ───────────────────────────────────────────── */

skillGapSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  },
})

const SkillGapAnalysis = mongoose.model('SkillGapAnalysis', skillGapSchema)

export default SkillGapAnalysis
