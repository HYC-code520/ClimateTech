import { InvestorTimeline } from "./charts/investor-timeline"

export function InvestorDetails({ investor }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Investment Timeline</h3>
        {/* Only show timeline if investor has real data */}
        {investor.investments && investor.investments.length > 0 ? (
          <InvestorTimeline data={investor.investments} />
        ) : (
          <p className="text-gray-400">No investment data available</p>
        )}
      </div>
      
      {/* Other investor details */}
    </div>
  )
} 