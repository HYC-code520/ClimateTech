import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import { InvestorCard } from "@/components/investor-card";
import { InvestorFilters } from "@/components/investor-filters";
import { InvestorComparison } from "@/components/investor-comparison";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// API fetching function
const fetchInvestors = async (page: number, pageSize: number, filters: any) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  // Add filters if they have values
  if (filters.minInvestments !== '') {
    params.append('minInvestments', filters.minInvestments);
  }
  
  if (filters.preferredStage !== '') {
    params.append('preferredStage', filters.preferredStage);
  }

  if (filters.searchTerm !== '') {
    params.append('searchTerm', filters.searchTerm);
  }

  if (filters.maxInvestments !== '') {
    params.append('maxInvestments', filters.maxInvestments);
  }
  
  console.log('Fetching with params:', Object.fromEntries(params));
  const response = await fetch(`/api/investors/timeline?${params}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function InvestorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [filters, setFilters] = useState({
    searchTerm: "",
    minInvestments: "",
    maxInvestments: "",
    preferredStage: "",
    sector: "",
    sortBy: "name"
  });

  // New state for comparison feature
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['investors', currentPage, pageSize, filters.minInvestments, filters.preferredStage, filters.searchTerm, filters.maxInvestments],
    queryFn: () => fetchInvestors(currentPage, pageSize, filters),
  });

  const investors = data?.investors || [];
  const pagination = data?.pagination;

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Toggle investor selection
  const toggleInvestorSelection = (investorId: number) => {
    setSelectedInvestors(prev => {
      if (prev.includes(investorId)) {
        return prev.filter(id => id !== investorId);
      } else {
        // Limit to 2 investors for comparison
        if (prev.length < 2) {
          return [...prev, investorId];
        } else {
          // Replace the first selected with the new one
          return [prev[1], investorId];
        }
      }
    });
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedInvestors([]);
    setComparisonMode(false);
  };

  // Start comparison
  const startComparison = () => {
    if (selectedInvestors.length === 2) {
      setComparisonMode(true);
    }
  };

  // Since filtering is now done on the backend, we can use the data directly
  const filteredInvestors = investors;

  // Calculate global maximum investment amount for normalized Y-axis
  const globalMaxInvestment = useMemo(() => {
    if (filteredInvestors.length === 0) return 0;
    
    let maxAmount = 0;
    filteredInvestors.forEach(investor => {
      investor.investments.forEach((investment: any) => {
        if (investment.amount > maxAmount) {
          maxAmount = investment.amount;
        }
      });
    });
    
    // Add some padding (20%) to the maximum for better visualization
    return maxAmount * 1.2;
  }, [filteredInvestors]);

  // Get selected investors for comparison
  const selectedInvestorsData = filteredInvestors.filter(inv => selectedInvestors.includes(inv.id));

  // If in comparison mode, show comparison view
  if (comparisonMode && selectedInvestorsData.length === 2) {
    return (
      <NavbarSidebarLayout>
        <InvestorComparison 
          investors={selectedInvestorsData}
          onClose={() => setComparisonMode(false)}
        />
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Investors</h1>
            <p className="text-gray-400">
              Track investment patterns and funding timelines • {filteredInvestors.length} investors
            </p>
          </div>
          
          {/* Comparison Controls */}
          <div className="flex items-center gap-4">
            {selectedInvestors.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{selectedInvestors.length}/2 selected</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelections}
                  className="text-gray-400 hover:text-[var(--botanical-green)]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {selectedInvestors.length === 2 && (
              <Button
                onClick={startComparison}
                className="bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Investors
              </Button>
            )}
          </div>
        </div>
        
        {/* Comparison Hint */}
        {selectedInvestors.length === 0 && (
          <div className="bg-[var(--botanical-green)]/10 border-2 border-[var(--botanical-green)] rounded-lg p-4">
            <p className="text-[var(--botanical-green)] text-sm">
              💡 <strong>Tip:</strong> Select any two investors by clicking the checkboxes to compare their investment timelines side-by-side.
            </p>
          </div>
        )}
        
        {/* Filters */}
        <InvestorFilters onFiltersChange={handleFiltersChange} />
        
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInvestors.map((investor: any) => (
                <InvestorCard 
                  key={investor.id} 
                  investor={investor}
                  isSelected={selectedInvestors.includes(investor.id)}
                  onToggleSelection={() => toggleInvestorSelection(investor.id)}
                  selectionMode={selectedInvestors.length > 0}
                  globalMaxInvestment={globalMaxInvestment}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(page => Math.min(pagination.totalPages, page + 1))}
                    disabled={currentPage === pagination.totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * pageSize + 1}
                      </span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, pagination.totalItems)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{pagination.totalItems}</span>
                      {' '}investors
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <Button
                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="rounded-l-md"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(page => Math.min(pagination.totalPages, page + 1))}
                        disabled={currentPage === pagination.totalPages}
                        variant="outline"
                        className="rounded-r-md"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
} 