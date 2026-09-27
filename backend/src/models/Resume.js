import mongoose from 'mongoose'

/* ── Sub-schemas matching frontend data shapes ──────────────── */

const experienceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { _id: false },
)

const educationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    cgpa: { type: String, default: '' },
    passingYear: { type: String, default: '' },
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: '' },
    techStack: { type: String, default: '' },
    description: { type: String, default: '' },
    github: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
  },
  { _id: false },
)

const certificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
  },
  { _id: false },
)

const achievementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, default: '' },
  },
  { _id: false },
)

const languageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    language: { type: String, default: '' },
    proficiency: { type: String, default: 'Intermediate' },
  },
  { _id: false },
)

const customSectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  { _id: false },
)

/* ── Main Resume schema ─────────────────────────────────────── */

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    personalInfo: {
      name: { type: String, default: '' },
      headline: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },

    summary: { type: String, default: '' },

    experiences: [experienceSchema],
    education: [educationSchema],
    skills: [{ type: String }],
    projects: [projectSchema],
    certifications: [certificationSchema],
    achievements: [achievementSchema],
    languages: [languageSchema],

    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      other: { type: String, default: '' },
    },

    customSections: [customSectionSchema],

    sectionOrder: [{ type: String }],
    activeTemplate: { type: String, default: 'modern' },

    /* AI suggestion cache */
    aiSuggestions: {
      suggestions: { type: mongoose.Schema.Types.Mixed, default: null },
      resumeHash: { type: String, default: '' },
      generatedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  },
)

/* ── JSON transform ──────────────────────────────────────────── */

resumeSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.userId
    return ret
  },
})

const Resume = mongoose.model('Resume', resumeSchema)

export default Resume
