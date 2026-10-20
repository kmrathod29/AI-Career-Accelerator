import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getRoadmap, listRoadmaps, setTopicCompletion, startRoadmap } from '../controllers/careerRoadmapController.js'

const router = Router()
router.use(requireAuth)
router.get('/', listRoadmaps)
router.get('/:roadmapId', getRoadmap)
router.post('/:roadmapId/start', startRoadmap)
router.patch('/:roadmapId/topics', setTopicCompletion)
export default router
