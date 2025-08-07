import * as React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from "recharts"
import { getStageColor, getSectorColor } from "@/lib/color-schemes"

interface InvestorTimelineProps {
  data: {
    date: string;
    amount: number;
    companyName?: string;
    stage?: string;
    sector?: string;
  }[];
  investorName: string;
  colorBy?: 'stage' | 'sector';
}

// Custom dot component that uses our color scheme
const CustomDot = (props: any) => {
  const { cx, cy, payload, colorBy } = props;
  
  let color = 'var(--botanical-green)'; // default
  
  if (colorBy === 'stage' && payload.stage) {
    color = getStageColor(payload.stage);
  } else if (colorBy === 'sector' && payload.sector) {
    color = getSectorColor(payload.sector);
  }
  
  return (
    <Dot 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={color} 
      stroke={color}
      strokeWidth={2}
    />
  );
};

export function InvestorTimeline({ data, investorName, colorBy = 'stage' }: InvestorTimelineProps) {
  return (
    <div className="w-full h-[250px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">
          Colored by: {colorBy === 'stage' ? 'Funding Stage' : 'Sector'}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => {/* We'll implement this toggle */}}
            className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Stage
          </button>
          <button 
            onClick={() => {/* We'll implement this toggle */}}
            className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Sector
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--botanical-green)" 
            strokeWidth={2}
            dot={<CustomDot colorBy={colorBy} />}
            activeDot={{ r: 8, fill: "var(--botanical-green)" }}
          />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
            tickFormatter={(date) => {
              const d = new Date(date);
              return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
            }}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `$${value.toFixed(0)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            labelStyle={{ color: "#9ca3af", fontSize: "12px" }}
            itemStyle={{ color: "#fff", fontSize: "14px" }}
            formatter={(value: number, name, props) => [
              `$${value.toFixed(1)}M`,
              "Investment Amount"
            ]}
            labelFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              });
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
                    <p className="text-gray-300 text-sm mb-2">
                      {new Date(label).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-white font-medium">
                      ${payload[0].value?.toFixed(1)}M
                    </p>
                    {data.companyName && (
                      <p className="text-gray-300 text-sm">
                        {data.companyName}
                      </p>
                    )}
                    {data.stage && (
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getStageColor(data.stage) }}
                        />
                        <span className="text-gray-400 text-sm">{data.stage}</span>
                      </div>
                    )}
                    {data.sector && (
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getSectorColor(data.sector) }}
                        />
                        <span className="text-gray-400 text-sm">{data.sector}</span>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 