import { Request, Response } from 'express'
import { SolarCalculationService } from '@/services/solarCalculationService'
import { sendSuccess, sendError, sendValidationError } from '@/utils/response'
import { CalculatorData } from '@/types'
import logger from '@/utils/logger'
import { body, validationResult } from 'express-validator'

const calculationService = new SolarCalculationService()

export const validateCalculation = [
  body('category').isIn(['HOME', 'BUSINESS', 'FARM']).withMessage('Category must be HOME, BUSINESS, or FARM'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('sunlightHours').isFloat({ min: 1, max: 12 }).withMessage('Sunlight hours must be between 1 and 12'),
  body('devices').isArray({ min: 1 }).withMessage('At least one device is required'),
  body('devices.*.type').trim().notEmpty().withMessage('Device type is required'),
  body('devices.*.quantity').isInt({ min: 1 }).withMessage('Device quantity must be at least 1'),
  body('devices.*.hoursPerDay').isInt({ min: 1, max: 24 }).withMessage('Hours per day must be between 1 and 24'),
  body('devices.*.powerConsumption').isInt({ min: 1 }).withMessage('Power consumption must be at least 1 watt'),
]

export const calculateSolarSystem = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array())
      return
    }

    const calculatorData: CalculatorData = req.body

    // Additional validation using the service
    const validationErrors = calculationService.validateCalculationInput(calculatorData)
    if (validationErrors.length > 0) {
      sendError(res, 'Validation failed', 400, validationErrors)
      return
    }

    const result = calculationService.calculateSolarSystem(calculatorData)

    sendSuccess(res, result, 'Solar system calculated successfully')
  } catch (error: any) {
    logger.error('Solar calculation error:', error)
    sendError(res, error.message || 'Calculation failed', 400)
  }
}

export const getDeviceCatalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const catalog = calculationService.getDeviceCatalog()
    sendSuccess(res, catalog, 'Device catalog retrieved successfully')
  } catch (error: any) {
    logger.error('Get device catalog error:', error)
    sendError(res, error.message || 'Failed to get device catalog', 500)
  }
}

export const getLocationSunlightData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location } = req.query

    if (!location || typeof location !== 'string') {
      sendError(res, 'Location parameter is required', 400)
      return
    }

    // Mock sunlight data for African countries
    const sunlightData: Record<string, number> = {
      'Nigeria': 5.5,
      'Kenya': 6.2,
      'South Africa': 5.8,
      'Ghana': 5.4,
      'Tanzania': 6.0,
      'Uganda': 5.9,
      'Rwanda': 5.7,
      'Ethiopia': 6.1,
      'Morocco': 5.9,
      'Egypt': 6.8,
      'Senegal': 5.6,
      'Mali': 6.3,
      'Burkina Faso': 6.0,
      'Ivory Coast': 5.3,
    }

    const averageSunlight = sunlightData[location] || 5.5 // Default fallback

    sendSuccess(res, {
      location,
      averageSunlightHours: averageSunlight,
      unit: 'hours/day'
    }, 'Sunlight data retrieved successfully')
  } catch (error: any) {
    logger.error('Get sunlight data error:', error)
    sendError(res, error.message || 'Failed to get sunlight data', 500)
  }
}