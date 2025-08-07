import { InvestorTimeline } from "./charts/investor-timeline";
import { TrendingUp, DollarSign, Hash } from "lucide-react";

interface InvestorCardProps {
  investor: {
    id: number;
    name: string;
    investments: Array<{
      date: string;
      amount: number;
      companyName?: string;
      stage?: string;
    }>;
    totalInvested: number;
    investmentCount: number;
  };
}

export function InvestorCard({ investor }: InvestorCardProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{investor.name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Hash className="w-4 h-4" />
            <span>{investor.investmentCount} deals</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>${(investor.totalInvested / 1000000).toFixed(1)}M total</span>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[var(--botanical-green)]" />
          <span className="text-sm font-medium text-gray-300">Investment Timeline</span>
        </div>
        <InvestorTimeline data={investor.investments} investorName={investor.name} />
      </div>

      {/* Recent Investments */}
      {investor.investments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Investments</h4>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {investor.investments.slice(-3).reverse().map((investment, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-white">{investment.companyName}</span>
                  <span className="text-gray-400 ml-2">({investment.stage})</span>
                </div>
                <div className="text-[var(--botanical-green)]">
                  ${investment.amount.toFixed(1)}M
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 