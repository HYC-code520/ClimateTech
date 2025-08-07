import * as React from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface InvestorTimelineProps {
  data: {
    date: string;
    amount: number;
    companyName?: string;
    stage?: string;
  }[];
  investorName: string;
}

export function InvestorTimeline({ data, investorName }: InvestorTimelineProps) {
  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--botanical-green)" 
            strokeWidth={3}
            dot={{ fill: "var(--botanical-green)", strokeWidth: 2, r: 6 }}
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
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 