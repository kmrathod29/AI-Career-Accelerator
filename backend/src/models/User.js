import mongoose from 'mongoose'

/* ── Sub-schemas ─────────────────────────────────────────── */

const profileSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    gender: { type: String, trim: true, maxlength: 20, default: '' },
    dateOfBirth: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, maxlength: 100, default: '' },
    city: { type: String, trim: true, maxlength: 100, default: '' },
    state: { type: String, trim: true, maxlength: 100, default: '' },
    bio: { type: String, trim: true, maxlength: 500, default: '' },
    avatar: { type: String, default: '' },
  },
  { _id: false },
)

const careerSchema = new mongoose.Schema(
  {
    currentRole: { type: String, trim: true, maxlength: 100, default: '' },
    experienceLevel: { type: String, trim: true, maxlength: 30, default: '' },
    education: { type: String, trim: true, maxlength: 30, default: '' },
    university: { type: String, trim: true, maxlength: 150, default: '' },
    degree: { type: String, trim: true, maxlength: 100, default: '' },
    branch: { type: String, trim: true, maxlength: 100, default: '' },
    passingYear: { type: String, trim: true, maxlength: 10, default: '' },
    skills: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
      validate: [arr => arr.length <= 30, 'Cannot exceed 30 skills'],
    },
    preferredRole: { type: String, trim: true, maxlength: 100, default: '' },
    preferredLocation: { type: String, trim: true, maxlength: 100, default: '' },
    expectedSalary: { type: String, trim: true, maxlength: 50, default: '' },
    employmentType: { type: String, trim: true, maxlength: 30, default: '' },
  },
  { _id: false },
)

const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: { type: String, trim: true, maxlength: 300, default: '' },
    github: { type: String, trim: true, maxlength: 300, default: '' },
    portfolio: { type: String, trim: true, maxlength: 300, default: '' },
    leetcode: { type: String, trim: true, maxlength: 300, default: '' },
    codeforces: { type: String, trim: true, maxlength: 300, default: '' },
    hackerrank: { type: String, trim: true, maxlength: 300, default: '' },
    website: { type: String, trim: true, maxlength: 300, default: '' },
  },
  { _id: false },
)

/* ── Main User schema ────────────────────────────────────── */

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [1, 'First name cannot be empty'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [1, 'Last name cannot be empty'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email cannot exceed 254 characters'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profile: {
      type: profileSchema,
      default: () => ({}),
    },
    career: {
      type: careerSchema,
      default: () => ({}),
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
)

/**
 * Return a plain object safe for API responses.
 * Never includes passwordHash.
 */
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    profile: this.profile?.toObject() ?? {},
    career: this.career?.toObject() ?? {},
    socialLinks: this.socialLinks?.toObject() ?? {},
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

/**
 * Ensure passwordHash is never included in JSON serialisation.
 */
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash
    delete ret.__v
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  },
})

const User = mongoose.model('User', userSchema)

export default User
