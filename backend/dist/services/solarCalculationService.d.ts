import { CalculatorData, SolarCalculationResult } from '@/types';
export declare class SolarCalculationService {
    private readonly PANEL_COST_PER_KW;
    private readonly BATTERY_COST_PER_KWH;
    private readonly INVERTER_COST_PER_KW;
    private readonly INSTALLATION_COST_PERCENTAGE;
    private readonly MAINTENANCE_COST_PERCENTAGE;
    private readonly SYSTEM_EFFICIENCY;
    private readonly BATTERY_DAYS;
    private readonly SYSTEM_LIFESPAN;
    private readonly BATTERY_REPLACEMENT_YEARS;
    private readonly ELECTRICITY_RATES;
    private readonly GOVERNMENT_INCENTIVE;
    private readonly FINANCING_INTEREST_RATE;
    private readonly CO2_FACTOR;
    calculateSolarSystem(data: CalculatorData): SolarCalculationResult;
    private calculateDailyConsumption;
    private calculatePanelSize;
    private calculateBatteryCapacity;
    private calculateInverterSize;
    private calculateCosts;
    private calculateCurrentElectricityBill;
    private calculateRealisticPaybackPeriod;
    private calculateRealisticROI;
    private calculateFinancingOptions;
    private calculateCO2Reduction;
    getDeviceCatalog(): {
        name: string;
        category: string;
        powerConsumption: number;
        icon: string;
    }[];
    validateCalculationInput(data: CalculatorData): string[];
}
//# sourceMappingURL=solarCalculationService.d.ts.map