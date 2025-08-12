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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Seed":
        return "#93c5fd"; // Gold
      case "Series A":
        return "#3b82f6"; // Green
      case "Series B":
        return "#2563eb"; // Blue
      case "Series C":
        return "#1d4ed8"; // Purple
      case "Series D+":
        return "#1e40af"; // Red
      default:
        return "#9E9E9E"; // Gray
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "Energy":
        return "#fbbf24"; // Orange
      case "Industry":
        return "#ef4444"; // Green
      case "Water":
        return "#0ea5e9"; // Blue
      default:
        return "#9E9E9E"; // Gray
    }
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Preferred Stage</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 border-gray-600 text-gray-200 max-w-xs">
                    <p>Find investors who typically invest in your startup's funding stage. Early-stage investors (Seed/Series A) often provide mentorship and connections, while later-stage investors (Series B+) focus on scaling and growth.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={filters.preferredStage} onValueChange={(value) => updateFilters({ preferredStage: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Any stage" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-300 shadow-sm" />
                    <span>Any Stage</span>
                  </div>
                </SelectItem>
                <SelectItem value="Seed" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getStageColor('Seed'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Seed</span>
                  </div>
                </SelectItem>
                <SelectItem value="Series A" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getStageColor('Series A'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Series A</span>
                  </div>
                </SelectItem>
                <SelectItem value="Series B" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getStageColor('Series B'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Series B</span>
                  </div>
                </SelectItem>
                <SelectItem value="Series C" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getStageColor('Series C'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Series C</span>
                  </div>
                </SelectItem>
                <SelectItem value="Series D+" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getStageColor('Series D+'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Series D+</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sector Focus */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Sector Focus</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 border-gray-600 text-gray-200 max-w-xs">
                    <p>Target investors who specialize in your climate tech sector. Sector-focused investors bring deep industry knowledge, relevant networks, and often have strategic partnerships that can accelerate your startup's growth and market entry.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={filters.sector} onValueChange={(value) => updateFilters({ sector: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Any sector" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400 border border-gray-300 shadow-sm" />
                    <span>Any Sector</span>
                  </div>
                </SelectItem>
                <SelectItem value="Energy" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getSectorColor('Energy'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Energy</span>
                  </div>
                </SelectItem>
                <SelectItem value="Industry" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getSectorColor('Industry'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Industry</span>
                  </div>
                </SelectItem>
                <SelectItem value="Water" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                      style={{ 
                        backgroundColor: getSectorColor('Water'),
                        boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                      }}
                    />
                    <span>Water</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Investment Size */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Typical Check Size</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 border-gray-600 text-gray-200 max-w-xs">
                    <p>Match your funding needs with investors' typical investment ranges. Smaller checks ($1M-5M) often come with more hands-on support, while larger checks ($20M+) are ideal for capital-intensive climate solutions that need significant funding to scale.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={filters.checkSize} onValueChange={(value) => updateFilters({ checkSize: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Any size" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">Any Size</SelectItem>
                <SelectItem value="small" className="text-white hover:bg-gray-700 focus:bg-gray-700">$1M - $5M</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-700 focus:bg-gray-700">$5M - $20M</SelectItem>
                <SelectItem value="large" className="text-white hover:bg-gray-700 focus:bg-gray-700">$20M - $100M</SelectItem>
                <SelectItem value="mega" className="text-white hover:bg-gray-700 focus:bg-gray-700">$100M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
} 