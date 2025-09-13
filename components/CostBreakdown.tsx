'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Costs {
  panels: number
  battery: number
  inverter: number
  installation: number
}

interface CostBreakdownProps {
  costs: Costs
  upfrontCost: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function CostBreakdown({ costs, upfrontCost }: CostBreakdownProps) {
  const data = [
    { name: 'Panels', value: costs.panels, color: COLORS[0] },
    { name: 'Battery', value: costs.battery, color: COLORS[1] },
    { name: 'Inverter', value: costs.inverter, color: COLORS[2] },
    { name: 'Installation', value: costs.installation, color: COLORS[3] },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            ${data.value.toLocaleString()} ({((data.value / upfrontCost) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${item.value.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  {((item.value / upfrontCost) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Total Cost</span>
              <span>${upfrontCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}