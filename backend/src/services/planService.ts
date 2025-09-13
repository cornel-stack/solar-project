import { PrismaClient, PlanCategory, PlanStatus } from '@prisma/client'
import prisma from '@/config/database'
import { SolarCalculationService } from './solarCalculationService'
import { CalculatorData, PaginationParams, PaginatedResponse } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export interface CreatePlanData {
  name: string
  category: PlanCategory
  location: string
  sunlightHours: number
  devices: Array<{
    type: string
    quantity: number
    hoursPerDay: number
    powerConsumption: number
  }>
}

export interface UpdatePlanData extends Partial<CreatePlanData> {
  status?: PlanStatus
}

export class PlanService {
  private calculationService = new SolarCalculationService()

  async createPlan(userId: string, data: CreatePlanData) {
    // Create the plan
    const plan = await prisma.solarPlan.create({
      data: {
        userId,
        name: data.name,
        category: data.category,
        location: data.location,
        sunlightHours: data.sunlightHours,
        status: 'DRAFT',
      },
      include: {
        devices: true,
      }
    })

    // Add devices
    if (data.devices.length > 0) {
      await prisma.device.createMany({
        data: data.devices.map(device => ({
          planId: plan.id,
          deviceType: device.type,
          quantity: device.quantity,
          hoursPerDay: device.hoursPerDay,
          powerConsumption: device.powerConsumption,
        }))
      })
    }

    // Calculate and store results
    const calculationResult = this.calculationService.calculateSolarSystem({
      category: data.category,
      location: data.location,
      sunlightHours: data.sunlightHours,
      devices: data.devices,
    })

    // Store calculation
    await prisma.calculation.create({
      data: {
        planId: plan.id,
        energyDemand: calculationResult.energyDemand,
        panelSize: calculationResult.panelSize,
        batteryCapacity: calculationResult.batteryCapacity,
        inverterSize: calculationResult.inverterSize,
        upfrontCost: calculationResult.upfrontCost,
        annualSavings: calculationResult.annualSavings,
        paybackPeriod: calculationResult.paybackPeriod,
        roi: calculationResult.roi,
        co2Reduction: calculationResult.co2Reduction,
        costBreakdown: calculationResult.costBreakdown,
      }
    })

    // Update plan with calculation results
    const updatedPlan = await prisma.solarPlan.update({
      where: { id: plan.id },
      data: {
        systemSpecs: {
          energyDemand: calculationResult.energyDemand,
          panelSize: calculationResult.panelSize,
          batteryCapacity: calculationResult.batteryCapacity,
          inverterSize: calculationResult.inverterSize,
        },
        financialData: {
          upfrontCost: calculationResult.upfrontCost,
          annualSavings: calculationResult.annualSavings,
          paybackPeriod: calculationResult.paybackPeriod,
          roi: calculationResult.roi,
          co2Reduction: calculationResult.co2Reduction,
        },
      },
      include: {
        devices: true,
        calculations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      }
    })

    return updatedPlan
  }

  async getUserPlans(
    userId: string, 
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params

    const skip = (page - 1) * limit
    const orderBy = { [sortBy]: sortOrder }

    const [plans, total] = await Promise.all([
      prisma.solarPlan.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy,
        include: {
          devices: true,
          calculations: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { quotes: true },
          },
        },
      }),
      prisma.solarPlan.count({ where: { userId } }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data: plans,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }

  async getPlanById(planId: string, userId?: string) {
    const plan = await prisma.solarPlan.findUnique({
      where: { id: planId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        devices: true,
        calculations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        quotes: {
          where: userId ? { userId } : undefined,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!plan) {
      throw new Error('Plan not found')
    }

    // Check if user has access to this plan
    if (!plan.isPublic && plan.userId !== userId) {
      throw new Error('Access denied')
    }

    return plan
  }

  async updatePlan(planId: string, userId: string, data: UpdatePlanData) {
    // Verify ownership
    const existingPlan = await prisma.solarPlan.findFirst({
      where: { id: planId, userId },
    })

    if (!existingPlan) {
      throw new Error('Plan not found or access denied')
    }

    // Update plan
    const updatedPlan = await prisma.solarPlan.update({
      where: { id: planId },
      data: {
        name: data.name,
        category: data.category,
        location: data.location,
        sunlightHours: data.sunlightHours,
        status: data.status,
      },
    })

    // Update devices if provided
    if (data.devices) {
      // Remove existing devices
      await prisma.device.deleteMany({
        where: { planId },
      })

      // Add new devices
      if (data.devices.length > 0) {
        await prisma.device.createMany({
          data: data.devices.map(device => ({
            planId,
            deviceType: device.type,
            quantity: device.quantity,
            hoursPerDay: device.hoursPerDay,
            powerConsumption: device.powerConsumption,
          }))
        })
      }

      // Recalculate if devices or parameters changed
      const calculationResult = this.calculationService.calculateSolarSystem({
        category: data.category || existingPlan.category,
        location: data.location || existingPlan.location,
        sunlightHours: data.sunlightHours || existingPlan.sunlightHours,
        devices: data.devices,
      })

      // Store new calculation
      await prisma.calculation.create({
        data: {
          planId,
          energyDemand: calculationResult.energyDemand,
          panelSize: calculationResult.panelSize,
          batteryCapacity: calculationResult.batteryCapacity,
          inverterSize: calculationResult.inverterSize,
          upfrontCost: calculationResult.upfrontCost,
          annualSavings: calculationResult.annualSavings,
          paybackPeriod: calculationResult.paybackPeriod,
          roi: calculationResult.roi,
          co2Reduction: calculationResult.co2Reduction,
          costBreakdown: calculationResult.costBreakdown,
        }
      })

      // Update plan with new calculation results
      await prisma.solarPlan.update({
        where: { id: planId },
        data: {
          systemSpecs: {
            energyDemand: calculationResult.energyDemand,
            panelSize: calculationResult.panelSize,
            batteryCapacity: calculationResult.batteryCapacity,
            inverterSize: calculationResult.inverterSize,
          },
          financialData: {
            upfrontCost: calculationResult.upfrontCost,
            annualSavings: calculationResult.annualSavings,
            paybackPeriod: calculationResult.paybackPeriod,
            roi: calculationResult.roi,
            co2Reduction: calculationResult.co2Reduction,
          },
        },
      })
    }

    return this.getPlanById(planId, userId)
  }

  async deletePlan(planId: string, userId: string) {
    // Verify ownership
    const plan = await prisma.solarPlan.findFirst({
      where: { id: planId, userId },
    })

    if (!plan) {
      throw new Error('Plan not found or access denied')
    }

    await prisma.solarPlan.delete({
      where: { id: planId },
    })
  }

  async duplicatePlan(planId: string, userId: string, newName?: string) {
    const originalPlan = await this.getPlanById(planId, userId)

    const devices = originalPlan.devices.map(device => ({
      type: device.deviceType,
      quantity: device.quantity,
      hoursPerDay: device.hoursPerDay,
      powerConsumption: device.powerConsumption,
    }))

    return this.createPlan(userId, {
      name: newName || `${originalPlan.name} (Copy)`,
      category: originalPlan.category,
      location: originalPlan.location,
      sunlightHours: originalPlan.sunlightHours,
      devices,
    })
  }

  async sharePlan(planId: string, userId: string) {
    // Verify ownership
    const plan = await prisma.solarPlan.findFirst({
      where: { id: planId, userId },
    })

    if (!plan) {
      throw new Error('Plan not found or access denied')
    }

    const shareToken = uuidv4()

    const updatedPlan = await prisma.solarPlan.update({
      where: { id: planId },
      data: {
        sharedToken: shareToken,
        isPublic: true,
      },
    })

    return {
      shareToken,
      shareUrl: `${process.env.FRONTEND_URL}/shared/${shareToken}`,
    }
  }

  async getSharedPlan(shareToken: string) {
    const plan = await prisma.solarPlan.findUnique({
      where: { sharedToken: shareToken },
      include: {
        user: {
          select: { id: true, name: true },
        },
        devices: true,
        calculations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!plan || !plan.isPublic) {
      throw new Error('Shared plan not found or no longer available')
    }

    return plan
  }
}