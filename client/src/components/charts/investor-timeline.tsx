import * as React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface InvestorTimelineProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export function InvestorTimeline({ data }: InvestorTimelineProps) {
  // Configuration for the chart's visual style
  const chartConfig = {
    line: {
      theme: {
        light: "var(--botanical-green)",
        dark: "var(--botanical-green)",
      },
    },
  }

  return (
    <div className="w-full h-[200px]">
      <ChartContainer config={chartConfig}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--botanical-green)" 
            strokeWidth={2}
            dot={{ fill: "var(--botanical-green)", r: 4 }}
          />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
          />
          <YAxis 
            stroke="#666"
            tickFormatter={(value) => `$${value}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "#9ca3af" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value: number) => [`$${value}M`, "Amount"]}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
} 