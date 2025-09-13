import { Router } from 'express'
import {
  createPlan,
  getUserPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  duplicatePlan,
  sharePlan,
  getSharedPlan,
  validateCreatePlan,
  validateUpdatePlan,
  validatePagination,
} from '@/controllers/planController'
import { authenticate, optionalAuth } from '@/middleware/auth'

const router = Router()

// Protected routes (require authentication)
router.post('/', authenticate, validateCreatePlan, createPlan)
router.get('/', authenticate, validatePagination, getUserPlans)
router.get('/:id', optionalAuth, getPlanById)
router.put('/:id', authenticate, validateUpdatePlan, updatePlan)
router.delete('/:id', authenticate, deletePlan)
router.post('/:id/duplicate', authenticate, duplicatePlan)
router.post('/:id/share', authenticate, sharePlan)

// Public shared plan route
router.get('/shared/:token', getSharedPlan)

export default router