import { Response } from 'express'
import { ApiResponse } from '@/types'

export const sendSuccess = <T>(
  res: Response, 
  data?: T, 
  message?: string, 
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  }
  return res.status(statusCode).json(response)
}

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400,
  errors?: any[]
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    errors
  }
  return res.status(statusCode).json(response)
}

export const sendValidationError = (
  res: Response,
  errors: any[],
  message: string = 'Validation failed'
): Response => {
  return sendError(res, message, 422, errors)
}