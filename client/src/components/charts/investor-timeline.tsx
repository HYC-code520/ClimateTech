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
  maxAmount?: number;
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

export function InvestorTimeline({ data, investorName, colorBy = 'stage', maxAmount }: InvestorTimelineProps) {
  // Convert date strings to timestamps for the chart
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      timestamp: new Date(item.date).getTime(),
      originalDate: item.date // Keep original for reference
    }));
  }, [data]);
  
  // Fixed start date: December 2024
  const fixedStartDate = new Date('2024-12-01').getTime();
  
  // Calculate end date: either the latest investment + 6 months, or June 2025 (whichever is later)
  const latestInvestmentDate = chartData.length > 0 
    ? Math.max(...chartData.map(d => d.timestamp))
    : fixedStartDate;
  
  const endDateFromData = new Date(latestInvestmentDate);
  endDateFromData.setMonth(endDateFromData.getMonth() + 6); // Add 6 months buffer
  
  const minEndDate = new Date('2025-06-01').getTime();
  const fixedEndDate = Math.max(endDateFromData.getTime(), minEndDate);

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
            className="text-xs px-2 py-1 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
          >
            Sector
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="timestamp" 
            type="number"
            scale="time"
            domain={[fixedStartDate, fixedEndDate]}
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={{ stroke: '#374151', strokeWidth: 1 }}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(timestamp) => {
              const d = new Date(timestamp);
              return `${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
            }}
          />
          <YAxis 
            axisLine={{ stroke: '#374151', strokeWidth: 1 }}
            tickLine={{ stroke: '#374151', strokeWidth: 1 }}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => `$${value}M`}
            domain={maxAmount ? [0, maxAmount] : [0, 'dataMax']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#fff", fontSize: "14px" }}
            formatter={(value: number, name, props) => [
              `$${value.toFixed(1)}M`,
              "Investment Amount"
            ]}
            labelFormatter={(timestamp) => {
              const d = new Date(timestamp);
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
                      {new Date(data.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-white font-medium">
                      ${payload[0].value?.toFixed(1)}M
                    </p>
                    {data.companyName && (
                      <p className="text-gray-400 text-sm">
                        {data.companyName}
                      </p>
                    )}
                    {data.stage && (
                      <p className="text-gray-400 text-sm">
                        {data.stage}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="var(--botanical-green)"
            strokeWidth={3}
            dot={<CustomDot colorBy={colorBy} />}
            activeDot={{ 
              r: 8, 
              fill: "var(--botanical-green)",
              stroke: "var(--botanical-green)",
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 