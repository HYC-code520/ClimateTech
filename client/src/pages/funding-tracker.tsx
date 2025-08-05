import { Leaf, User, Search, ChevronDown, Calendar, Filter, ExternalLink, MapPin, DollarSign, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";

// Sample data
const sampleFundingEvents = [
  {
    id: 1,
    companyName: "GreenCem",
    fundingDate: "2025-07-01",
    fundingStage: "Series A",
    amountRaised: "$15M USD",
    sector: "Carbon Tech",
    leadInvestors: ["Clean Capital"],
    country: "USA",
    problem: "High greenhouse gas emissions from cement production",
    impactMetric: "30,000 tCO2e abated annually",
    tags: ["Hardware", "B2B", "Female-Founded"],
    sourceUrl: "https://example.com/greeniem-funding"
  },
  {
    id: 2,
    companyName: "AquaTech Solutions",
    fundingDate: "2025-06-15",
    fundingStage: "Seed",
    amountRaised: "$3.2M USD",
    sector: "Water Tech",
    leadInvestors: ["Blue Ocean Ventures", "H2O Capital"],
    country: "Germany",
    problem: "Water scarcity and inefficient water treatment systems",
    impactMetric: "1M liters of water saved daily",
    tags: ["SaaS", "B2B", "AI/ML"],
    sourceUrl: "https://example.com/aquatech-funding"
  },
  {
    id: 3,
    companyName: "SolarGrid",
    fundingDate: "2025-05-20",
    fundingStage: "Series B",
    amountRaised: "$45M USD",
    sector: "Energy",
    leadInvestors: ["Energy Ventures"],
    country: "India",
    problem: "Inefficient solar energy distribution and storage",
    impactMetric: "200 GWh renewable energy generated annually",
    tags: ["Hardware", "B2C", "Grid Tech"],
    sourceUrl: "https://example.com/solargrid-funding"
  }
];

export default function FundingTrackerPage() {
  const [, setLocation] = useLocation();
  const [selectedFilters, setSelectedFilters] = useState({
    sector: "",
    fundingStage: "",
    country: "",
    leadInvestor: "",
    dateFrom: "",
    dateTo: "",
    tags: []
  });
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <header className="relative z-50 px-8 md:px-12 py-8 flex items-center justify-between">
        {/* Left Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button 
            onClick={handleGoHome}
            className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
          >
            Home
          </button>
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
      <main className="px-8 md:px-12 pb-16">
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
                  placeholder="Search companies, investors, or keywords..."
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
                value={selectedFilters.leadInvestor}
                onChange={(e) => setSelectedFilters({...selectedFilters, leadInvestor: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Date From</label>
              <input
                type="date"
                value={selectedFilters.dateFrom}
                onChange={(e) => setSelectedFilters({...selectedFilters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date To</label>
              <input
                type="date"
                value={selectedFilters.dateTo}
                onChange={(e) => setSelectedFilters({...selectedFilters, dateTo: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-[var(--botanical-green)] focus:outline-none"
              />
            </div>

            {/* Tags (placeholder for multi-select) */}
            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {["Hardware", "SaaS", "B2B", "B2C", "Female-Founded", "AI/ML", "Grid Tech"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-sm border border-gray-600 rounded-full hover:border-[var(--botanical-green)] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setSelectedFilters({
                sector: "",
                fundingStage: "",
                country: "",
                leadInvestor: "",
                dateFrom: "",
                dateTo: "",
                tags: []
              })}
              className="bg-transparent border border-gray-600 text-white hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Funding Events Display */}
        <div className="space-y-4 mt-8 bg-blue-500 p-4 rounded">
          <div className="flex items-center gap-2 mb-6 bg-yellow-500 p-2 rounded">
            <Building2 className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-white">Recent Funding Events</h2>
            <span className="text-gray-400">({sampleFundingEvents.length} results)</span>
          </div>

          {/* Debug info */}
          <div className="text-white bg-red-500 p-2 rounded">
            Debug: Found {sampleFundingEvents.length} events
          </div>

          {/* Another debug marker */}
          <div className="text-black bg-green-400 p-4 rounded text-xl font-bold">
            🎯 DATA SECTION STARTS HERE - You should see cards below this!
          </div>

          {sampleFundingEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 border-2 border-white rounded-lg overflow-hidden mb-4">
              {/* Main Event Card */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => toggleExpanded(event.id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                  {/* Company Name & Date */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-1">{event.companyName}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar className="w-3 h-3" />
                      {event.fundingDate}
                    </div>
                  </div>

                  {/* Funding Details */}
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Stage</div>
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm inline-block">
                      {event.fundingStage}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Amount</div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-medium">{event.amountRaised}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Sector</div>
                    <div className="text-white">{event.sector}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Country</div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{event.country}</span>
                    </div>
                  </div>
                </div>

                {/* Lead Investors */}
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-1">Lead Investors</div>
                  <div className="flex flex-wrap gap-2">
                    {event.leadInvestors.map((investor, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-sm">
                        {investor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEvent === event.id && (
                <div className="border-t border-gray-700 p-6 bg-gray-800/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Problem Statement</h4>
                      <p className="text-white mb-4">{event.problem}</p>

                      <h4 className="text-sm font-medium text-gray-300 mb-2">Impact Metric</h4>
                      <p className="text-[var(--botanical-green)]">{event.impactMetric}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-sm font-medium text-gray-300 mb-2">Source</h4>
                      <a 
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Source
                      </a>
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