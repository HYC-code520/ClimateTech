import { InvestorTimeline } from "./charts/investor-timeline"

// Mock data for the timeline
const mockTimelineData = [
  { date: "2023-01-15", amount: 10 },
  { date: "2023-03-22", amount: 25 },
  { date: "2023-06-10", amount: 15 },
  { date: "2023-09-05", amount: 40 },
  { date: "2023-11-20", amount: 30 },
  { date: "2024-01-15", amount: 50 },
]

export function InvestorDetails({ investor }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Investment Timeline</h3>
        <InvestorTimeline data={mockTimelineData} />
      </div>
      
      {/* Other investor details */}
    </div>
  )
} 