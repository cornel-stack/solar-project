import { CalculatorData, SolarCalculationResult, DeviceData } from '@/types'

export class SolarCalculationService {
  // Pricing constants (can be moved to database or config)
  private readonly PANEL_COST_PER_KW = 800 // USD per kW
  private readonly BATTERY_COST_PER_KWH = 300 // USD per kWh
  private readonly INVERTER_COST_PER_KW = 200 // USD per kW
  private readonly INSTALLATION_COST_PERCENTAGE = 0.2 // 20% of component costs
  private readonly ELECTRICITY_RATE = 0.15 // USD per kWh
  private readonly CO2_FACTOR = 0.4 // kg CO2 per kWh
  private readonly SYSTEM_EFFICIENCY = 0.85 // 85% system efficiency
  private readonly BATTERY_DAYS = 2 // Days of backup power

  calculateSolarSystem(data: CalculatorData): SolarCalculationResult {
    // Calculate total daily energy consumption
    const totalDailyConsumption = this.calculateDailyConsumption(data.devices)
    const energyDemand = totalDailyConsumption / 1000 // Convert to kWh

    // Calculate system components
    const panelSize = this.calculatePanelSize(energyDemand, data.sunlightHours)
    const batteryCapacity = this.calculateBatteryCapacity(energyDemand)
    const inverterSize = this.calculateInverterSize(panelSize)

    // Calculate costs
    const costBreakdown = this.calculateCosts(panelSize, batteryCapacity, inverterSize)
    const upfrontCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0)

    // Calculate financial metrics
    const annualSavings = this.calculateAnnualSavings(energyDemand)
    const paybackPeriod = this.calculatePaybackPeriod(upfrontCost, annualSavings)
    const roi = this.calculateROI(upfrontCost, annualSavings)

    // Calculate environmental impact
    const co2Reduction = this.calculateCO2Reduction(energyDemand)

    return {
      energyDemand: Math.round(energyDemand * 10) / 10,
      panelSize: Math.ceil(panelSize),
      batteryCapacity: Math.ceil(batteryCapacity),
      inverterSize: Math.ceil(inverterSize),
      upfrontCost: Math.round(upfrontCost),
      annualSavings: Math.round(annualSavings),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      roi: Math.round(roi),
      co2Reduction: Math.round(co2Reduction),
      costBreakdown
    }
  }

  private calculateDailyConsumption(devices: DeviceData[]): number {
    return devices.reduce((total, device) => {
      return total + (device.powerConsumption * device.quantity * device.hoursPerDay)
    }, 0)
  }

  private calculatePanelSize(energyDemand: number, sunlightHours: number): number {
    // Account for system efficiency and add safety margin
    const requiredPanelSize = (energyDemand / sunlightHours) / this.SYSTEM_EFFICIENCY
    return requiredPanelSize * 1.2 // 20% safety margin
  }

  private calculateBatteryCapacity(energyDemand: number): number {
    // Battery capacity for backup days plus depth of discharge consideration
    return energyDemand * this.BATTERY_DAYS * 1.25 // 25% extra for depth of discharge
  }

  private calculateInverterSize(panelSize: number): number {
    // Inverter should handle peak power with margin
    return panelSize * 1.2 // 20% oversizing
  }

  private calculateCosts(panelSize: number, batteryCapacity: number, inverterSize: number) {
    const panels = panelSize * this.PANEL_COST_PER_KW
    const battery = batteryCapacity * this.BATTERY_COST_PER_KWH
    const inverter = inverterSize * this.INVERTER_COST_PER_KW
    const installation = (panels + battery + inverter) * this.INSTALLATION_COST_PERCENTAGE

    return {
      panels: Math.round(panels),
      battery: Math.round(battery),
      inverter: Math.round(inverter),
      installation: Math.round(installation)
    }
  }

  private calculateAnnualSavings(energyDemand: number): number {
    return energyDemand * 365 * this.ELECTRICITY_RATE
  }

  private calculatePaybackPeriod(upfrontCost: number, annualSavings: number): number {
    return upfrontCost / annualSavings
  }

  private calculateROI(upfrontCost: number, annualSavings: number): number {
    // 20-year ROI calculation
    const totalSavings = annualSavings * 20
    const netSavings = totalSavings - upfrontCost
    return (netSavings / upfrontCost) * 100
  }

  private calculateCO2Reduction(energyDemand: number): number {
    return energyDemand * 365 * this.CO2_FACTOR
  }

  // Method to get device catalog data
  getDeviceCatalog() {
    return [
      { name: 'LED Light Bulb', category: 'lighting', powerConsumption: 10, icon: '💡' },
      { name: 'Phone Charger', category: 'electronics', powerConsumption: 5, icon: '📱' },
      { name: 'Radio', category: 'electronics', powerConsumption: 15, icon: '📻' },
      { name: 'TV', category: 'electronics', powerConsumption: 100, icon: '📺' },
      { name: 'Laptop', category: 'electronics', powerConsumption: 65, icon: '💻' },
      { name: 'Refrigerator', category: 'appliances', powerConsumption: 150, icon: '🧊' },
      { name: 'Fan', category: 'appliances', powerConsumption: 75, icon: '🌀' },
      { name: 'Water Pump', category: 'industrial', powerConsumption: 500, icon: '💧' },
      { name: 'Washing Machine', category: 'appliances', powerConsumption: 400, icon: '👕' },
      { name: 'Air Conditioner', category: 'appliances', powerConsumption: 1200, icon: '❄️' },
      { name: 'Microwave', category: 'appliances', powerConsumption: 800, icon: '📦' },
      { name: 'Electric Iron', category: 'appliances', powerConsumption: 1000, icon: '👔' },
    ]
  }

  // Validate calculation input
  validateCalculationInput(data: CalculatorData): string[] {
    const errors: string[] = []

    if (!data.category || !['HOME', 'BUSINESS', 'FARM'].includes(data.category)) {
      errors.push('Valid category is required (HOME, BUSINESS, or FARM)')
    }

    if (!data.location || data.location.trim().length === 0) {
      errors.push('Location is required')
    }

    if (!data.sunlightHours || data.sunlightHours <= 0 || data.sunlightHours > 12) {
      errors.push('Sunlight hours must be between 1 and 12')
    }

    if (!data.devices || data.devices.length === 0) {
      errors.push('At least one device is required')
    }

    if (data.devices) {
      data.devices.forEach((device, index) => {
        if (!device.type || device.type.trim().length === 0) {
          errors.push(`Device ${index + 1}: Type is required`)
        }
        if (!device.quantity || device.quantity <= 0) {
          errors.push(`Device ${index + 1}: Quantity must be greater than 0`)
        }
        if (!device.hoursPerDay || device.hoursPerDay <= 0 || device.hoursPerDay > 24) {
          errors.push(`Device ${index + 1}: Hours per day must be between 1 and 24`)
        }
        if (!device.powerConsumption || device.powerConsumption <= 0) {
          errors.push(`Device ${index + 1}: Power consumption must be greater than 0`)
        }
      })
    }

    return errors
  }
}