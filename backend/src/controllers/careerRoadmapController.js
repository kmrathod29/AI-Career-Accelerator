import CareerRoadmapProgress from '../models/CareerRoadmapProgress.js'
import { careerRoadmaps, getCareerRoadmap } from '../data/careerRoadmaps.js'
import { sendError, sendSuccess } from '../utils/apiResponse.js'

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const view = (roadmap, completedIds) => {
  const topics = roadmap.stages.flatMap(s => s.topics.map(t => ({ id: `${slug(s.title)}/${slug(t.title)}`, ...t })))
  const completed = new Set(completedIds)
  const stages = roadmap.stages.map((s, si) => {
    const stageTopics = s.topics.map(t => ({ id: `${slug(s.title)}/${slug(t.title)}`, ...t, completed: completed.has(`${slug(s.title)}/${slug(t.title)}`) }))
    const done = stageTopics.filter(t => t.completed).length
    return { ...s, order: si + 1, topics: stageTopics, completedTopics: done, totalTopics: stageTopics.length, progress: stageTopics.length ? Math.round(done / stageTopics.length * 100) : 0, status: done === stageTopics.length ? 'completed' : done ? 'in-progress' : 'not-started' }
  })
  const done = topics.filter(t => completed.has(t.id)).length
  return { ...roadmap, stages, completedTopics: done, totalTopics: topics.length, progress: topics.length ? Math.round(done / topics.length * 100) : 0 }
}

export async function listRoadmaps(req, res) {
  try {
    const records = await CareerRoadmapProgress.find({ userId: req.user._id }).lean()
    const saved = new Map(records.map(record => [record.roadmapId, record.completedTopics]))
    return sendSuccess(res, { roadmaps: careerRoadmaps.map(r => ({ id: r.id, title: r.title, description: r.description, difficulty: r.difficulty, estimatedDuration: r.estimatedDuration, stageCount: r.stages.length, progress: view(r, saved.get(r.id) || []).progress, started: saved.has(r.id) })) })
  } catch (error) { console.error('List career roadmaps error:', error.message); return sendError(res, 'Failed to load career roadmaps', 500) }
}

export async function getRoadmap(req, res) {
  const roadmap = getCareerRoadmap(req.params.roadmapId)
  if (!roadmap) return sendError(res, 'Career roadmap not found', 404)
  try {
    const record = await CareerRoadmapProgress.findOne({ userId: req.user._id, roadmapId: roadmap.id }).lean()
    return sendSuccess(res, { roadmap: view(roadmap, record?.completedTopics || []) })
  } catch (error) { console.error('Get career roadmap error:', error.message); return sendError(res, 'Failed to load career roadmap', 500) }
}

export async function startRoadmap(req, res) {
  const { roadmapId } = req.params
  const roadmap = getCareerRoadmap(roadmapId)
  if (!roadmap) return sendError(res, 'Career roadmap not found', 404)
  const { experienceLevel, currentSkills = '', learningGoal = '' } = req.body || {}
  if (!['beginner', 'intermediate', 'advanced'].includes(experienceLevel)) return sendError(res, 'Choose a valid experience level', 400)
  if (typeof currentSkills !== 'string' || currentSkills.length > 2000) return sendError(res, 'Current skills must be 2000 characters or fewer', 400)
  if (typeof learningGoal !== 'string' || learningGoal.length > 1000) return sendError(res, 'Learning goal must be 1000 characters or fewer', 400)
  try {
    const record = await CareerRoadmapProgress.findOneAndUpdate(
      { userId: req.user._id, roadmapId },
      { $setOnInsert: { experienceLevel, currentSkills: currentSkills.trim(), learningGoal: learningGoal.trim() } },
      { upsert: true, new: true, runValidators: true },
    ).lean()
    return sendSuccess(res, { roadmap: view(roadmap, record.completedTopics) })
  } catch (error) { console.error('Start career roadmap error:', error.message); return sendError(res, 'Failed to save your career roadmap', 500) }
}

export async function setTopicCompletion(req, res) {
  const { roadmapId } = req.params
  const roadmap = getCareerRoadmap(roadmapId)
  const { topicId, completed } = req.body || {}
  if (!roadmap) return sendError(res, 'Career roadmap not found', 404)
  if (typeof topicId !== 'string' || topicId.length > 200 || typeof completed !== 'boolean') return sendError(res, 'A valid topicId and completed boolean are required', 400)
  const validTopicIds = roadmap.stages.flatMap(s => s.topics.map(t => `${slug(s.title)}/${slug(t.title)}`))
  if (!validTopicIds.includes(topicId)) return sendError(res, 'Roadmap topic not found', 404)
  try {
    const update = completed
      ? { $addToSet: { completedTopics: topicId } }
      : { $pull: { completedTopics: topicId } }
    const record = await CareerRoadmapProgress.findOneAndUpdate({ userId: req.user._id, roadmapId }, update, { upsert: true, new: true, runValidators: true }).lean()
    return sendSuccess(res, { roadmap: view(roadmap, record.completedTopics) })
  } catch (error) { console.error('Update career roadmap progress error:', error.message); return sendError(res, 'Failed to update roadmap progress', 500) }
}
