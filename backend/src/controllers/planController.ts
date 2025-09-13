import { Request, Response } from 'express'
import { PlanService } from '@/services/planService'
import { sendSuccess, sendError, sendValidationError } from '@/utils/response'
import logger from '@/utils/logger'
import { body, query, validationResult } from 'express-validator'

const planService = new PlanService()

export const validateCreatePlan = [
  body('name').trim().notEmpty().withMessage('Plan name is required'),
  body('category').isIn(['HOME', 'BUSINESS', 'FARM']).withMessage('Category must be HOME, BUSINESS, or FARM'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('sunlightHours').isFloat({ min: 1, max: 12 }).withMessage('Sunlight hours must be between 1 and 12'),
  body('devices').isArray({ min: 1 }).withMessage('At least one device is required'),
  body('devices.*.type').trim().notEmpty().withMessage('Device type is required'),
  body('devices.*.quantity').isInt({ min: 1 }).withMessage('Device quantity must be at least 1'),
  body('devices.*.hoursPerDay').isInt({ min: 1, max: 24 }).withMessage('Hours per day must be between 1 and 24'),
  body('devices.*.powerConsumption').isInt({ min: 1 }).withMessage('Power consumption must be at least 1 watt'),
]

export const validateUpdatePlan = [
  body('name').optional().trim().notEmpty().withMessage('Plan name cannot be empty'),
  body('category').optional().isIn(['HOME', 'BUSINESS', 'FARM']).withMessage('Category must be HOME, BUSINESS, or FARM'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('sunlightHours').optional().isFloat({ min: 1, max: 12 }).withMessage('Sunlight hours must be between 1 and 12'),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'ARCHIVED']).withMessage('Invalid status'),
  body('devices').optional().isArray().withMessage('Devices must be an array'),
]

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['name', 'createdAt', 'updatedAt', 'category']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
]

export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array())
      return
    }

    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const plan = await planService.createPlan(req.user.id, req.body)

    sendSuccess(res, plan, 'Solar plan created successfully', 201)
  } catch (error: any) {
    logger.error('Create plan error:', error)
    sendError(res, error.message || 'Failed to create plan', 400)
  }
}

export const getUserPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array())
      return
    }

    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const { page, limit, sortBy, sortOrder } = req.query
    const paginationParams = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    }

    const result = await planService.getUserPlans(req.user.id, paginationParams)

    sendSuccess(res, result, 'Plans retrieved successfully')
  } catch (error: any) {
    logger.error('Get user plans error:', error)
    sendError(res, error.message || 'Failed to get plans', 500)
  }
}

export const getPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const plan = await planService.getPlanById(id, userId)

    sendSuccess(res, plan, 'Plan retrieved successfully')
  } catch (error: any) {
    logger.error('Get plan by ID error:', error)
    const statusCode = error.message.includes('not found') ? 404 : 
                      error.message.includes('Access denied') ? 403 : 500
    sendError(res, error.message || 'Failed to get plan', statusCode)
  }
}

export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array())
      return
    }

    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const { id } = req.params
    const plan = await planService.updatePlan(id, req.user.id, req.body)

    sendSuccess(res, plan, 'Plan updated successfully')
  } catch (error: any) {
    logger.error('Update plan error:', error)
    const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400
    sendError(res, error.message || 'Failed to update plan', statusCode)
  }
}

export const deletePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const { id } = req.params
    await planService.deletePlan(id, req.user.id)

    sendSuccess(res, null, 'Plan deleted successfully')
  } catch (error: any) {
    logger.error('Delete plan error:', error)
    const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400
    sendError(res, error.message || 'Failed to delete plan', statusCode)
  }
}

export const duplicatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const { id } = req.params
    const { name } = req.body

    const plan = await planService.duplicatePlan(id, req.user.id, name)

    sendSuccess(res, plan, 'Plan duplicated successfully', 201)
  } catch (error: any) {
    logger.error('Duplicate plan error:', error)
    const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400
    sendError(res, error.message || 'Failed to duplicate plan', statusCode)
  }
}

export const sharePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const { id } = req.params
    const result = await planService.sharePlan(id, req.user.id)

    sendSuccess(res, result, 'Plan shared successfully')
  } catch (error: any) {
    logger.error('Share plan error:', error)
    const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 400
    sendError(res, error.message || 'Failed to share plan', statusCode)
  }
}

export const getSharedPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params
    const plan = await planService.getSharedPlan(token)

    sendSuccess(res, plan, 'Shared plan retrieved successfully')
  } catch (error: any) {
    logger.error('Get shared plan error:', error)
    sendError(res, error.message || 'Failed to get shared plan', 404)
  }
}