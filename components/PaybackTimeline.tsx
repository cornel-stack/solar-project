'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PaybackTimelineProps {
  upfrontCost: number
  annualSavings: number
}

export default function PaybackTimeline({ upfrontCost, annualSavings }: PaybackTimelineProps) {
  // Generate 20 years of data
  const data = []
  let cumulativeSavings = 0
  
  for (let year = 0; year <= 20; year++) {
    if (year === 0) {
      cumulativeSavings = -upfrontCost
    } else {
      cumulativeSavings += annualSavings
    }
    
    data.push({
      year,
      cumulativeSavings,
      netValue: cumulativeSavings,
      breakeven: 0
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">Year {label}</p>
          <p className="text-sm text-gray-600">
            Net Value: {value >= 0 ? '+' : ''}${value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Payback Timeline</h3>
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="paybackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="cumulativeSavings"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#paybackGradient)"
            />
            {/* Break-even line */}
            <Line
              type="monotone"
              dataKey="breakeven"
              stroke="#374151"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">Year 0</div>
          <div className="text-sm text-red-600">Initial Investment</div>
          <div className="text-lg font-semibold text-gray-900">-${upfrontCost.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            Year {Math.ceil(upfrontCost / annualSavings)}
          </div>
          <div className="text-sm text-yellow-600">Break Even</div>
          <div className="text-lg font-semibold text-gray-900">$0</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">Year 20</div>
          <div className="text-sm text-green-600">Total Savings</div>
          <div className="text-lg font-semibold text-gray-900">
            +${((annualSavings * 20) - upfrontCost).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}