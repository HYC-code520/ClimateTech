import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout"
import { InvestorTimeline } from "@/components/charts/investor-timeline"

// Mock data for the timeline
const mockTimelineData = [
  { date: "2023-01-15", amount: 10 },
  { date: "2023-03-22", amount: 25 },
  { date: "2023-06-10", amount: 15 },
  { date: "2023-09-05", amount: 40 },
  { date: "2023-11-20", amount: 30 },
  { date: "2024-01-15", amount: 50 },
]

export default function InvestorsPage() {
  return (
    <NavbarSidebarLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Investors</h1>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Investment Timeline</h2>
          <InvestorTimeline data={mockTimelineData} />
        </div>
      </div>
    </NavbarSidebarLayout>
  )
} 