import mongoose from 'mongoose'

const roadmapProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: String, required: true },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  currentSkills: { type: String, maxlength: 2000, default: '' },
  learningGoal: { type: String, maxlength: 1000, default: '' },
  completedTopics: { type: [{ type: String, maxlength: 200 }], default: [] },
}, { timestamps: true })

roadmapProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true })
roadmapProgressSchema.set('toJSON', { transform(_doc, ret) { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret } })
export default mongoose.model('CareerRoadmapProgress', roadmapProgressSchema)
