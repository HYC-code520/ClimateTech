import { Leaf, User, Search, ChevronDown, Calendar, Filter, ExternalLink, MapPin, DollarSign, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../hooks/use-debounce";

// Define the shape of a single funding event based on our API contract
type FundingEvent = {
  EventID: number;
  CompanyName: string;
  FundingDate: string;
  FundingStage: string;
  AmountRaisedUSD: number;
  LeadInvestors: string;
  ClimateTechSector: string;
  Country: string;
  SourceURL: string;
  Problem: string;
  ImpactMetric: string;
  Tags: string;
};

// API fetching function
const fetchFundingEvents = async (filters: any): Promise<FundingEvent[]> => {
  // Build the query string from the filters object
  const queryParams = new URLSearchParams();
  for (const key in filters) {
    if (filters[key]) {
      queryParams.append(key, filters[key]);
    }
  }

  const response = await fetch(`/api/events/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export default function FundingTrackerPage() {
  const [, setLocation] = useLocation();
  const [selectedFilters, setSelectedFilters] = useState({
    sector: "",
    fundingStage: "",
    country: "",
    investorName: "", // Changed from leadInvestor to match API
    startDate: "",    // Changed from dateFrom
    endDate: "",      // Changed from dateTo
    tags: ""          // Changed from array to comma-separated string
  });
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Combine debounced search term with other filters for the API query
  const queryFilters = {
    ...selectedFilters,
    companyName: debouncedSearchTerm,
  };

  // Use TanStack Query to fetch, cache, and manage the data
  const { data: fundingEvents = [], isLoading, isError, error } = useQuery<FundingEvent[]>({
    queryKey: ['fundingEvents', queryFilters], // The key includes filters, so it refetches when they change
    queryFn: () => fetchFundingEvents(queryFilters),
  });

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleSignUp = () => {
    setLocation("/signup");
  };

  const toggleExpanded = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation Header */}
      <header className="relative z-50 px-8 md:px-12 py-8 flex items-center justify-between">
        {/* Left Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button 
            className="text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors font-medium"
          >
            Funding Tracker
          </button>
          <button 
            onClick={() => setLocation("/insights")}
            className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
          >
            Insights
          </button>
          <button 
            onClick={() => setLocation("/about")}
            className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
          >
            About
          </button>
        </nav>

        {/* Mobile spacer */}
        <div className="md:hidden"></div>

        {/* Center Logo */}
        <button 
          onClick={handleGoHome}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Leaf className="text-[var(--botanical-green)] w-6 h-6" />
          <span className="text-white font-semibold text-lg tracking-wide">ECOLENS</span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleSignUp}
            className="bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-[var(--botanical-green)] transition-all px-4 md:px-6 py-2 rounded-full text-sm"
          >
            Sign up
          </Button>
          <button
            onClick={handleLogin}
            className="w-10 h-10 bg-[var(--botanical-green)] rounded-full flex items-center justify-center hover:bg-[var(--botanical-dark)] transition-colors"
          >
            <User className="text-white w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 md:px-12 pb-16 flex-grow">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl text-white leading-none tracking-tight font-semibold mb-4">
            Funding Tracker
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Track climate tech funding rounds, investments, and market trends in real-time.
          </p>
        </div>

        {/* Filter/Search Panel */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-[var(--botanical-green)]" />
            <h2 className="text-xl font-semibold">Filters & Search</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="col-span-full mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies, investors, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[var(--botanical-green)] focus:outline-none"
                />
              </div>
            </div>

            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Sector</label>
              <div className="relative">
                <select 
                  value={selectedFilters.sector}
                  onChange={(e) => setSelectedFilters({...selectedFilters, sector: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none appearance-none"
                >
                  <option value="">All Sectors</option>
                  <option value="Energy">Energy</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Food & Ag">Food & Ag</option>
                  <option value="Carbon Tech">Carbon Tech</option>
                  <option value="Water Tech">Water Tech</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Funding Stage Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Funding Stage</label>
              <div className="relative">
                <select 
                  value={selectedFilters.fundingStage}
                  onChange={(e) => setSelectedFilters({...selectedFilters, fundingStage: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none appearance-none"
                >
                  <option value="">All Stages</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C">Series C</option>
                  <option value="Grant">Grant</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <div className="relative">
                <select 
                  value={selectedFilters.country}
                  onChange={(e) => setSelectedFilters({...selectedFilters, country: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none appearance-none"
                >
                  <option value="">All Countries</option>
                  <option value="USA">United States</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Lead Investor Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Lead Investor</label>
              <input
                type="text"
                placeholder="Search investors..."
                value={selectedFilters.investorName}
                onChange={(e) => setSelectedFilters({...selectedFilters, investorName: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Date From</label>
              <input
                type="date"
                value={selectedFilters.startDate}
                onChange={(e) => setSelectedFilters({...selectedFilters, startDate: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date To</label>
              <input
                type="date"
                value={selectedFilters.endDate}
                onChange={(e) => setSelectedFilters({...selectedFilters, endDate: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>

            {/* Tags (placeholder for multi-select) */}
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">Tags</label>
              {/* This is a simplified version for now. A real multi-select would be more complex. */}
              <input
                type="text"
                placeholder="Enter tags, comma-separated (e.g. SaaS,B2B)"
                value={selectedFilters.tags}
                onChange={(e) => setSelectedFilters({...selectedFilters, tags: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                setSelectedFilters({
                  sector: "",
                  fundingStage: "",
                  country: "",
                  investorName: "",
                  startDate: "",
                  endDate: "",
                  tags: ""
                });
                setSearchTerm(""); // Also clear the search term
              }}
              className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Funding Events Display */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-[var(--botanical-green)]" />
            <h2 className="text-xl font-semibold text-white">Recent Funding Events</h2>
            <span className="text-gray-400">({fundingEvents.length} results)</span>
          </div>

          {/* Loading and Error States */}
          {isLoading && <div className="text-center p-8">Loading events...</div>}
          {isError && <div className="text-center p-8 text-red-500">Error fetching data: {error.message}</div>}

          {/* Data Display */}
          {!isLoading && !isError && fundingEvents.map((event) => (
            <div key={event.EventID} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden mb-4 hover:border-gray-600 transition-colors">
              {/* Main Event Card */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => toggleExpanded(event.EventID)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                  {/* Company Name & Date */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-1">{event.CompanyName}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.FundingDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Funding Details */}
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Stage</div>
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm inline-block">
                      {event.FundingStage}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Amount</div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">${(event.AmountRaisedUSD / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Sector</div>
                    <div className="text-white">{event.ClimateTechSector}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Country</div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.Country}</span>
                    </div>
                  </div>
                </div>

                {/* Lead Investors */}
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-1">Lead Investors</div>
                  <div className="flex flex-wrap gap-2">
                    {/* The API currently returns a single investor name string */}
                    <span className="px-2 py-1 bg-gray-800 rounded text-sm">
                      {event.LeadInvestors}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEvent === event.EventID && (
                <div className="border-t border-gray-700 p-6 bg-gray-800/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Problem Statement</h4>
                      <p className="text-white mb-4">{event.Problem}</p>

                      <h4 className="text-sm font-medium text-gray-300 mb-2">Impact Metric</h4>
                      <p className="text-[var(--botanical-green)]">{event.ImpactMetric}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.Tags.split(',').map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-sm font-medium text-gray-300 mb-2">Source</h4>
                      {event.SourceURL ? (
                        <a 
                          href={event.SourceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Source
                        </a>
                      ) : (
                        <p className="text-white/60">No source available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full border border-[var(--botanical-green)] rounded-3xl px-4 py-3 space-y-2 sm:space-y-0" style={{ borderWidth: '1px' }}>
          <div className="flex items-center space-x-2 text-white/80">
            <span>Power by</span>
            <span className="text-[var(--botanical-green)] font-medium">public data + AI tagging</span>
          </div>
          <div className="text-white/80">
            Updated: August 2025
          </div>
        </div>
      </footer>
    </div>
  );
}