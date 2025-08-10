import { InvestorTimeline } from "./charts/investor-timeline";
import { TrendingUp, DollarSign, Hash, ArrowLeft, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

interface InvestorComparisonProps {
  investors: Array<{
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
  }>;
  onClose: () => void;
}

export function InvestorComparison({ investors, onClose }: InvestorComparisonProps) {
  if (investors.length !== 2) return null;

  const [investor1, investor2] = investors;

  // Calculate global maximum for comparison charts
  const globalMaxInvestment = useMemo(() => {
    let maxAmount = 0;
    investors.forEach(investor => {
      investor.investments.forEach((investment: any) => {
        if (investment.amount > maxAmount) {
          maxAmount = investment.amount;
        }
      });
    });
    return maxAmount * 1.2; // Add 20% padding
  }, [investors]);

  // Calculate comparison metrics
  const avgInvestment1 = investor1.totalInvested / investor1.investmentCount;
  const avgInvestment2 = investor2.totalInvested / investor2.investmentCount;
  
  const mostRecentInvestment1 = investor1.investments.length > 0 
    ? Math.max(...investor1.investments.map(inv => new Date(inv.date).getTime()))
    : 0;
  const mostRecentInvestment2 = investor2.investments.length > 0 
    ? Math.max(...investor2.investments.map(inv => new Date(inv.date).getTime()))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Investor Comparison</h2>
          <p className="text-gray-400">Side-by-side analysis of investment patterns</p>
        </div>
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>

      {/* Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investor 1 Overview */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{investor1.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-[var(--botanical-green)]">{investor1.investmentCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-2xl font-bold text-[var(--botanical-green)]">
                ${(investor1.totalInvested / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg per Deal</p>
              <p className="text-lg font-semibold text-white">
                ${(avgInvestment1 / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Activity</p>
              <p className="text-lg font-semibold text-white">
                {mostRecentInvestment1 ? new Date(mostRecentInvestment1).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Investor 2 Overview */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{investor2.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-blue-400">{investor2.investmentCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-2xl font-bold text-blue-400">
                ${(investor2.totalInvested / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg per Deal</p>
              <p className="text-lg font-semibold text-white">
                ${(avgInvestment2 / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Activity</p>
              <p className="text-lg font-semibold text-white">
                {mostRecentInvestment2 ? new Date(mostRecentInvestment2).toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Timeline Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investor 1 Timeline */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--botanical-green)]" />
            <h4 className="text-lg font-semibold text-white">{investor1.name} Timeline</h4>
          </div>
          <InvestorTimeline 
            data={investor1.investments} 
            investorName={investor1.name}
            maxAmount={globalMaxInvestment}
          />
        </div>

        {/* Investor 2 Timeline */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">{investor2.name} Timeline</h4>
          </div>
          <InvestorTimeline 
            data={investor2.investments} 
            investorName={investor2.name}
            maxAmount={globalMaxInvestment}
          />
        </div>
      </div>

      {/* Recent Investments Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investor 1 Recent Investments */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            {investor1.name} - Recent Investments
          </h4>
          <div className="space-y-3">
            {investor1.investments.slice(-5).reverse().map((investment, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                <div>
                  <p className="text-white font-medium">{investment.companyName}</p>
                  <p className="text-gray-400 text-sm">
                    {investment.stage} • {new Date(investment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-[var(--botanical-green)] font-semibold">
                  ${investment.amount.toFixed(1)}M
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investor 2 Recent Investments */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            {investor2.name} - Recent Investments
          </h4>
          <div className="space-y-3">
            {investor2.investments.slice(-5).reverse().map((investment, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                <div>
                  <p className="text-white font-medium">{investment.companyName}</p>
                  <p className="text-gray-400 text-sm">
                    {investment.stage} • {new Date(investment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-blue-400 font-semibold">
                  ${investment.amount.toFixed(1)}M
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 