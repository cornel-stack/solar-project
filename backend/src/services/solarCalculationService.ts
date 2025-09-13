import { CalculatorData, SolarCalculationResult, DeviceData } from '@/types'

export class SolarCalculationService {
  // Updated pricing constants for African markets (including import duties, logistics, and installation complexity)
  private readonly PANEL_COST_PER_KW = 1200 // USD per kW (higher due to import costs and duties)
  private readonly BATTERY_COST_PER_KWH = 450 // USD per kWh (lithium batteries with import costs)
  private readonly INVERTER_COST_PER_KW = 350 // USD per kW (quality inverters with warranty)
  private readonly INSTALLATION_COST_PERCENTAGE = 0.35 // 35% of component costs (complex African installations)
  private readonly MAINTENANCE_COST_PERCENTAGE = 0.02 // 2% annual maintenance cost
  private readonly SYSTEM_EFFICIENCY = 0.78 // 78% system efficiency (realistic for African conditions)
  private readonly BATTERY_DAYS = 3 // 3 days of backup power (frequent outages)
  private readonly SYSTEM_LIFESPAN = 20 // years
  private readonly BATTERY_REPLACEMENT_YEARS = 8 // Battery replacement cycle
  
  // Electricity pricing tiers (progressive pricing common in Africa)
  private readonly ELECTRICITY_RATES = {
    HOME: { baseRate: 0.08, tierRate: 0.18, tierThreshold: 200 }, // KWh per month
    BUSINESS: { baseRate: 0.12, tierRate: 0.22, tierThreshold: 500 },
    FARM: { baseRate: 0.06, tierRate: 0.15, tierThreshold: 1000 }
  }
  
  // Government incentives and financing options
  private readonly GOVERNMENT_INCENTIVE = 0.15 // 15% tax rebate/subsidy
  private readonly FINANCING_INTEREST_RATE = 0.12 // 12% annual interest rate
  private readonly CO2_FACTOR = 0.6 // kg CO2 per kWh (higher for coal-heavy African grids)

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
    
    // Apply government incentive
    const netUpfrontCost = upfrontCost * (1 - this.GOVERNMENT_INCENTIVE)

    // Calculate realistic financial metrics
    const monthlyEnergyDemand = energyDemand * 30
    const currentElectricityBill = this.calculateCurrentElectricityBill(monthlyEnergyDemand, data.category)
    const annualSavings = currentElectricityBill * 12
    const maintenanceCost = upfrontCost * this.MAINTENANCE_COST_PERCENTAGE
    const netAnnualSavings = annualSavings - maintenanceCost
    
    // Calculate battery replacement cost over system lifetime
    const batteryReplacements = Math.floor(this.SYSTEM_LIFESPAN / this.BATTERY_REPLACEMENT_YEARS)
    const batteryReplacementCost = batteryReplacements * costBreakdown.battery * 0.7 // 70% of original cost
    
    // Realistic payback calculation including all costs
    const adjustedPaybackPeriod = this.calculateRealisticPaybackPeriod(
      netUpfrontCost, 
      netAnnualSavings, 
      batteryReplacementCost
    )
    
    const roi = this.calculateRealisticROI(netUpfrontCost, netAnnualSavings, batteryReplacementCost)

    // Calculate environmental impact
    const co2Reduction = this.calculateCO2Reduction(energyDemand)

    // Calculate financing options
    const financingOptions = this.calculateFinancingOptions(netUpfrontCost, annualSavings)

    return {
      energyDemand: Math.round(energyDemand * 10) / 10,
      panelSize: Math.ceil(panelSize),
      batteryCapacity: Math.ceil(batteryCapacity),
      inverterSize: Math.ceil(inverterSize),
      upfrontCost: Math.round(upfrontCost),
      // netUpfrontCost: Math.round(netUpfrontCost),
      // currentElectricityBill: Math.round(currentElectricityBill),
      annualSavings: Math.round(annualSavings),
      // netAnnualSavings: Math.round(netAnnualSavings),
      // maintenanceCost: Math.round(maintenanceCost),
      batteryReplacementCost: Math.round(batteryReplacementCost),
      paybackPeriod: Math.round(adjustedPaybackPeriod * 10) / 10,
      roi: Math.round(roi),
      co2Reduction: Math.round(co2Reduction),
      costBreakdown,
      financingOptions,
      governmentIncentive: this.GOVERNMENT_INCENTIVE
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

  private calculateCurrentElectricityBill(monthlyEnergyDemand: number, category: string): number {
    const rates = this.ELECTRICITY_RATES[category as keyof typeof this.ELECTRICITY_RATES]
    
    if (monthlyEnergyDemand <= rates.tierThreshold) {
      return monthlyEnergyDemand * rates.baseRate
    } else {
      const baseAmount = rates.tierThreshold * rates.baseRate
      const tierAmount = (monthlyEnergyDemand - rates.tierThreshold) * rates.tierRate
      return baseAmount + tierAmount
    }
  }

  private calculateRealisticPaybackPeriod(
    netUpfrontCost: number, 
    netAnnualSavings: number, 
    batteryReplacementCost: number
  ): number {
    // Simple payback considering battery replacement in year 8
    let cumulativeSavings = 0
    let year = 0
    
    while (cumulativeSavings < netUpfrontCost && year < this.SYSTEM_LIFESPAN) {
      year++
      cumulativeSavings += netAnnualSavings
      
      // Subtract battery replacement cost in replacement years
      if (year % this.BATTERY_REPLACEMENT_YEARS === 0 && year < this.SYSTEM_LIFESPAN) {
        cumulativeSavings -= (batteryReplacementCost / (this.SYSTEM_LIFESPAN / this.BATTERY_REPLACEMENT_YEARS))
      }
    }
    
    return year > this.SYSTEM_LIFESPAN ? this.SYSTEM_LIFESPAN : year
  }

  private calculateRealisticROI(
    netUpfrontCost: number, 
    netAnnualSavings: number, 
    batteryReplacementCost: number
  ): number {
    const totalSavings = netAnnualSavings * this.SYSTEM_LIFESPAN
    const totalCosts = netUpfrontCost + batteryReplacementCost
    const netProfit = totalSavings - totalCosts
    
    return (netProfit / totalCosts) * 100
  }

  private calculateFinancingOptions(netUpfrontCost: number, annualSavings: number) {
    // 5-year loan option
    const loanTerm5 = 5
    const monthlyRate5 = this.FINANCING_INTEREST_RATE / 12
    const monthlyPayment5 = (netUpfrontCost * monthlyRate5 * Math.pow(1 + monthlyRate5, loanTerm5 * 12)) / 
                           (Math.pow(1 + monthlyRate5, loanTerm5 * 12) - 1)
    
    // 10-year loan option
    const loanTerm10 = 10
    const monthlyPayment10 = (netUpfrontCost * monthlyRate5 * Math.pow(1 + monthlyRate5, loanTerm10 * 12)) / 
                            (Math.pow(1 + monthlyRate5, loanTerm10 * 12) - 1)
    
    return {
      loan5Year: {
        term: loanTerm5,
        monthlyPayment: Math.round(monthlyPayment5),
        totalPayment: Math.round(monthlyPayment5 * loanTerm5 * 12),
        interestRate: this.FINANCING_INTEREST_RATE
      },
      loan10Year: {
        term: loanTerm10,
        monthlyPayment: Math.round(monthlyPayment10),
        totalPayment: Math.round(monthlyPayment10 * loanTerm10 * 12),
        interestRate: this.FINANCING_INTEREST_RATE
      },
      cashPayback: Math.round(netUpfrontCost / (annualSavings / 12)) // months to break even with cash
    }
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