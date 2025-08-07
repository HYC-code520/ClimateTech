import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import { InvestorCard } from "@/components/investor-card";
import { InvestorFilters } from "@/components/investor-filters";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

// API fetching function
const fetchInvestors = async () => {
  const response = await fetch('/api/investors/timeline');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function InvestorsPage() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    minInvestments: "",
    maxInvestments: "",
    preferredStage: "",
    sector: "",
    sortBy: "name"
  });

  const { data: investors = [], isLoading, isError } = useQuery({
    queryKey: ['investors'],
    queryFn: fetchInvestors,
  });

  // Filter and sort investors based on current filters
  const filteredInvestors = useMemo(() => {
    let filtered = [...investors];

    // Search by name
    if (filters.searchTerm) {
      filtered = filtered.filter(investor =>
        investor.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filter by investment count
    if (filters.minInvestments) {
      filtered = filtered.filter(investor =>
        investor.investmentCount >= parseInt(filters.minInvestments)
      );
    }
    if (filters.maxInvestments) {
      filtered = filtered.filter(investor =>
        investor.investmentCount <= parseInt(filters.maxInvestments)
      );
    }

    // Filter by preferred stage (if they have investments in that stage)
    if (filters.preferredStage) {
      filtered = filtered.filter(investor =>
        investor.investments.some((inv: any) => inv.stage === filters.preferredStage)
      );
    }

    // Sort investors
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "mostActive":
          return b.investmentCount - a.investmentCount;
        case "totalInvested":
          return b.totalInvested - a.totalInvested;
        case "recentActivity":
          const aLatest = Math.max(...a.investments.map((inv: any) => new Date(inv.date).getTime()));
          const bLatest = Math.max(...b.investments.map((inv: any) => new Date(inv.date).getTime()));
          return bLatest - aLatest;
        case "dealCount":
          return b.investmentCount - a.investmentCount;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [investors, filters]);

  return (
    <NavbarSidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investors</h1>
          <p className="text-gray-400">
            Track investment patterns and funding timelines • {filteredInvestors.length} investors
          </p>
        </div>
        
        {/* Filters */}
        <InvestorFilters onFiltersChange={setFilters} />
        
        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--botanical-green)]" />
          </div>
        ) : isError ? (
          <div className="text-red-400 text-center py-12">
            Error loading investors data
          </div>
        ) : filteredInvestors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No investors found matching your criteria</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestors.map((investor: any) => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
} 