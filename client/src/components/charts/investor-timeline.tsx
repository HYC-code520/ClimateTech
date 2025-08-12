import * as React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot, Legend } from "recharts"
import { getStageColor, getSectorColor } from "@/lib/color-schemes"
import { useState } from "react";

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

// Helper function to format amounts that are already in millions
const formatAmountInMillions = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`;
  } else if (value >= 1) {
    return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`;
  } else if (value >= 0.1) {
    return `$${value.toFixed(1)}M`;
  } else {
    return `$${(value * 1000).toFixed(0)}K`;
  }
};

// Custom Legend component
const CustomLegend = ({ colorMode, data }: { colorMode: 'stage' | 'sector', data: any[] }) => {
  // Get unique stages/sectors from data
  const uniqueValues = Array.from(new Set(data.map(item => colorMode === 'stage' ? item.stage : item.sector))).filter(Boolean);
  
  return (
    <div className="flex flex-wrap gap-3 mt-2 px-4">
      {uniqueValues.map((value) => (
        <div key={value} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
            style={{ 
              backgroundColor: colorMode === 'stage' ? getStageColor(value) : getSectorColor(value),
              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
            }}
          />
          <span className="text-xs text-gray-300">{value}</span>
        </div>
      ))}
    </div>
  );
};

// Custom dot component that uses our color scheme
const CustomDot = (props: any) => {
  const { cx, cy, payload, colorBy } = props;
  
  let color = 'var(--botanical-green)'; // default
  let label = '';
  
  if (colorBy === 'stage' && payload.stage) {
    color = getStageColor(payload.stage);
    label = payload.stage;
  } else if (colorBy === 'sector' && payload.sector) {
    color = getSectorColor(payload.sector);
    label = payload.sector;
  }
  
  return (
    <Dot 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={color} 
      stroke={color}
      strokeWidth={2}
      className="cursor-pointer"
      data-tip={label}
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
  
  // Create a fixed 12-month scale starting from December 2024
  const generateMonthScale = () => {
    const months = [];
    
    // Start from December 2024
    const startDate = new Date('2024-12-01');
    
    // Generate 12 months from December 2024
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate);
      monthDate.setMonth(startDate.getMonth() + i);
      months.push({
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        timestamp: monthDate.getTime(),
        label: monthDate.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    
    return months;
  };

  const monthScale = generateMonthScale();
  const startTimestamp = monthScale[0].timestamp;
  const endTimestamp = monthScale[monthScale.length - 1].timestamp;

  // Add state for the color mode
  const [colorMode, setColorMode] = useState<'stage' | 'sector'>(colorBy);

  return (
    <div className="w-full">
      {/* Color mode toggle */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">
          Colored by: {colorMode === 'stage' ? 'Funding Stage' : 'Sector'}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setColorMode('stage')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              colorMode === 'stage' 
                ? 'bg-[var(--botanical-green)] text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Stage
          </button>
          <button 
            onClick={() => setColorMode('sector')}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              colorMode === 'sector' 
                ? 'bg-[var(--botanical-green)] text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sector
          </button>
        </div>
      </div>

      {/* Legend */}
      <CustomLegend colorMode={colorMode} data={data} />

      {/* Chart */}
      <div className="h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="timestamp" 
              type="number"
              scale="time"
              domain={[startTimestamp, endTimestamp]}
              axisLine={{ stroke: '#374151', strokeWidth: 1 }}
              tickLine={{ stroke: '#374151', strokeWidth: 1 }}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              ticks={monthScale.map(m => m.timestamp)}
              tickFormatter={(timestamp) => {
                const month = monthScale.find(m => m.timestamp === timestamp);
                return month ? month.label : '';
              }}
            />
            <YAxis 
              axisLine={{ stroke: '#374151', strokeWidth: 1 }}
              tickLine={{ stroke: '#374151', strokeWidth: 1 }}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickFormatter={formatAmountInMillions}
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
                formatAmountInMillions(value),
                "Investment Amount"
              ]}
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
                        {formatAmountInMillions(payload[0].value as number)}
                      </p>
                      {/* Add stage/sector info */}
                      <p className="text-gray-400 text-sm mt-1">
                        {colorMode === 'stage' ? data.stage : data.sector}
                      </p>
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
              dot={<CustomDot colorBy={colorMode} />}
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
    </div>
  );
} 