interface SolarPlan {
  energyDemand: number
  panelSize: number
  batteryCapacity: number
  inverterSize: number
  upfrontCost: number
  annualSavings: number
  paybackPeriod: number
  roi: number
}

interface SolarPlanSummaryProps {
  solarPlan: SolarPlan
}

export default function SolarPlanSummary({ solarPlan }: SolarPlanSummaryProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">System Specifications</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {solarPlan.energyDemand} <span className="text-lg">kWh/day</span>
          </div>
          <div className="text-sm text-gray-600">Energy Demand</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {solarPlan.panelSize} <span className="text-lg">kW</span>
          </div>
          <div className="text-sm text-gray-600">Panel Size</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {solarPlan.batteryCapacity} <span className="text-lg">kWh</span>
          </div>
          <div className="text-sm text-gray-600">Battery</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {solarPlan.inverterSize} <span className="text-lg">kW</span>
          </div>
          <div className="text-sm text-gray-600">Inverter</div>
        </div>
      </div>
    </div>
  )
}