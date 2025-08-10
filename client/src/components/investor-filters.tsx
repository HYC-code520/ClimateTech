import { Search, Filter, TrendingUp, DollarSign, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface InvestorFiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    minInvestments: string;
    maxInvestments: string;
    preferredStage: string;
    sector: string;
    checkSize: string;
    sortBy: string;
  }) => void;
}

export function InvestorFilters({ onFiltersChange }: InvestorFiltersProps) {
  const [filters, setFilters] = useState({
    searchTerm: "",
    minInvestments: "",
    maxInvestments: "",
    preferredStage: "all",
    sector: "all",
    checkSize: "all",
    sortBy: "name"
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    // Convert "all" values to empty strings for filtering logic
    const filtersForParent = {
      ...updated,
      preferredStage: updated.preferredStage === "all" ? "" : updated.preferredStage,
      sector: updated.sector === "all" ? "" : updated.sector,
      checkSize: updated.checkSize === "all" ? "" : updated.checkSize,
    };
    
    onFiltersChange(filtersForParent);
  };

  const clearFilters = () => {
    const cleared = {
      searchTerm: "",
      minInvestments: "",
      maxInvestments: "",
      preferredStage: "all",
      sector: "all",
      checkSize: "all",
      sortBy: "name"
    };
    setFilters(cleared);
    
    // Convert "all" values to empty strings for filtering logic
    const clearedForParent = {
      ...cleared,
      preferredStage: "",
      sector: "",
      checkSize: "",
    };
    
    onFiltersChange(clearedForParent);
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search investors by name..."
          value={filters.searchTerm}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort By */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="mostActive">Most Active</SelectItem>
              <SelectItem value="totalInvested">Highest Investment</SelectItem>
              <SelectItem value="recentActivity">Recent Activity</SelectItem>
              <SelectItem value="dealCount">Number of Deals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="border-2 border-[var(--botanical-green)] text-[var(--botanical-green)] hover:border-[var(--botanical-green)] hover:bg-[var(--botanical-green)]/10 hover:text-[var(--botanical-green)] !bg-transparent !border-[var(--botanical-green)]"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showAdvanced ? 'Hide' : 'More'} Filters
        </Button>

        {/* Clear Filters */}
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-[var(--botanical-green)]/70 hover:text-[var(--botanical-green)] hover:bg-[var(--botanical-green)]/10"
        >
          Clear All
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
          {/* Investment Count Range */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Investment Count</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 border-gray-600 text-gray-200 max-w-xs">
                    <p>Filter investors by the total number of deals they have made. This shows how active an investor is in the market.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minInvestments}
                onChange={(e) => updateFilters({ minInvestments: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxInvestments}
                onChange={(e) => updateFilters({ maxInvestments: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Preferred Stage */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Preferred Stage</label>
            <Select value={filters.preferredStage} onValueChange={(value) => updateFilters({ preferredStage: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Any stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Stage</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C">Series C</SelectItem>
                <SelectItem value="Series D+">Series D+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sector Focus */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Sector Focus</label>
            <Select value={filters.sector} onValueChange={(value) => updateFilters({ sector: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Any sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Sector</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Food & Agriculture">Food & Agriculture</SelectItem>
                <SelectItem value="Industry">Industry</SelectItem>
                <SelectItem value="Buildings">Buildings</SelectItem>
                <SelectItem value="Carbon Management">Carbon Management</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Investment Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Typical Check Size</label>
            <Select value={filters.checkSize} onValueChange={(value) => updateFilters({ checkSize: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Size</SelectItem>
                <SelectItem value="small">$1M - $5M</SelectItem>
                <SelectItem value="medium">$5M - $20M</SelectItem>
                <SelectItem value="large">$20M - $100M</SelectItem>
                <SelectItem value="mega">$100M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
} 