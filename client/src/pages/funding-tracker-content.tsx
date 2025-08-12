import { Search, ChevronDown, Calendar, Filter, ExternalLink, MapPin, DollarSign, Building2, ChevronRight, ArrowDownUp, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../hooks/use-debounce";
import { StageSelect } from "@/components/stage-select";
import { SectorSelect } from "@/components/sector-select";
import { getStageColor, getSectorColor } from "@/lib/color-schemes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  // Build the query string from the filters object, removing any empty keys
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== '')
  );
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(cleanedFilters)) {
    queryParams.append(key, String(value));
  }

  const response = await fetch(`/api/events/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function FundingTrackerContent() {
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
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' or 'asc'

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Combine debounced search term with other filters for the API query
  const queryFilters = {
    ...selectedFilters,
    searchTerm: debouncedSearchTerm, // Changed from companyName to enable universal search
    sortOrder: sortOrder,
  };

  // Use TanStack Query to fetch, cache, and manage the data
  const { data: fundingEvents = [], isLoading, isError, error } = useQuery<FundingEvent[]>({
    queryKey: ['fundingEvents', queryFilters], // The key includes filters, so it refetches when they change
    queryFn: ({ queryKey }) => fetchFundingEvents(queryKey[1]),
  });

  const toggleExpanded = (eventId: number) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const { toast } = useToast();
  const feedbackEmail = import.meta.env.VITE_FEEDBACK_EMAIL || ""; // optional

  async function submitChangeRequest(evt: any, field: string, newValue: string, reason?: string) {
    const payload = {
      eventId: evt.EventID,
      company: evt.CompanyName,
      field,
      oldValue: (evt as any)[field] ?? null,
      newValue,
      reason: reason || "",
      timestamp: new Date().toISOString(),
      page: window.location.href,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      if (feedbackEmail) {
        const subject = `Change request: ${evt.CompanyName} (${evt.EventID})`;
        const body = JSON.stringify(payload, null, 2);
        const mailto = `mailto:${feedbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailto, "_blank");
      }
      toast({
        title: "Change request prepared",
        description: feedbackEmail
          ? "Email draft opened. JSON also copied to clipboard."
          : "Copied to clipboard. Paste into email/Slack.",
      });
    } catch {
      toast({ title: "Couldn’t copy to clipboard", variant: "destructive" });
    }
  }

  return (
    <div className="max-w-full">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Funding Events
        </h1>
        <p className="text-gray-400">
          Explore climate tech funding rounds, investments, and market trends with comprehensive data and insights.
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
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Sector</label>
            <SectorSelect
              value={selectedFilters.sector}
              onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, sector: value }))}
            />
          </div>

          {/* Funding Stage Filter */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Funding Stage</label>
            <StageSelect
              value={selectedFilters.fundingStage}
              onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, fundingStage: value }))}
            />
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

          {/* Tags */}
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
        <div className="flex items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--botanical-green)]" />
                <h2 className="text-xl font-semibold text-white">Recent Funding Events</h2>
                <span className="text-gray-400">({fundingEvents.length} results)</span>
            </div>
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by date:</span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                    <ArrowDownUp className="w-4 h-4 mr-2" />
                    {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </Button>
            </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && <div className="text-center p-8">Loading events...</div>}
        {isError && <div className="text-center p-8 text-red-500">Error fetching data: {error.message}</div>}

        {/* Data Display */}
        {!isLoading && !isError && fundingEvents.map((event) => (
          <div key={event.EventID} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden mb-4 hover:border-[var(--botanical-green)] hover:shadow-lg hover:shadow-[var(--botanical-green)]/10 transition-all duration-200 group">
            {/* Main Event Card */}
            <div 
              className="p-6 pb-16 cursor-pointer hover:bg-gray-800/50 transition-all duration-200 relative"
              onClick={() => toggleExpanded(event.EventID)}
            >
              {/* Expand/Collapse Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 text-gray-400 group-hover:text-[var(--botanical-green)] transition-colors">
                <span className="text-xs font-medium hidden sm:inline">
                  {expandedEvent === event.EventID ? 'Collapse' : 'Expand'}
                </span>
                <ChevronRight 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    expandedEvent === event.EventID ? 'rotate-90' : ''
                  }`}
                />
              </div>
              
              {/* Suggest edit – bottom-right before expansion */}
              <div className="absolute bottom-4 right-4" onClick={(e) => e.stopPropagation()}>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="px-3 py-1 text-sm bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 flex items-center gap-2">
                      <Pencil className="w-4 h-4" />
                      Suggest edit
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white font-bold">
                        Suggest an edit
                      </DialogTitle>
                    </DialogHeader>

                    <form
                      className="space-y-4"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget as HTMLFormElement;
                        const field = (form.elements.namedItem("field") as HTMLSelectElement).value;
                        const newValue = (form.elements.namedItem("newValue") as HTMLInputElement).value;
                        const reason = (form.elements.namedItem("reason") as HTMLTextAreaElement).value;
                        await submitChangeRequest(event, field, newValue, reason);
                      }}
                    >
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Field</label>
                        <select name="field" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
                          <option value="CompanyName">Company Name</option>
                          <option value="FundingDate">Funding Date</option>
                          <option value="FundingStage">Funding Stage</option>
                          <option value="AmountRaisedUSD">Amount (USD)</option>
                          <option value="LeadInvestors">Lead Investors</option>
                          <option value="ClimateTechSector">Sector</option>
                          <option value="Country">Country</option>
                          <option value="SourceURL">Source URL</option>
                          <option value="Problem">Problem</option>
                          <option value="Tags">Tags</option>
                        </select>
                        <div className="text-xs text-gray-500">
                          Current: <span className="text-gray-300">{String((event as any)[(document?.querySelector('select[name=\"field\"]') as HTMLSelectElement)?.value] ?? '')}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">New value</label>
                        <input name="newValue" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Reason (optional)</label>
                        <textarea name="reason" rows={3} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
                      </div>

                      <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] rounded">
                          Submit
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                {/* Company Name & Date */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-1">{event.CompanyName}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    {event.FundingDate ? new Date(event.FundingDate).toLocaleDateString() : 'Date not available'}
                  </div>
                </div>

                {/* Funding Details */}
                <div>
                  <div className="text-sm text-gray-400 mb-1">Stage</div>
                  <div className="px-2 py-1 rounded text-sm inline-flex items-center gap-2"
                       style={{ 
                         backgroundColor: `${getStageColor(event.FundingStage)}20`,
                         color: getStageColor(event.FundingStage)
                       }}>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStageColor(event.FundingStage) }}
                    />
                    {event.FundingStage}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Amount</div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">
                      {event.AmountRaisedUSD ? `$${event.AmountRaisedUSD.toLocaleString()} USD` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Sector</div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getSectorColor(event.ClimateTechSector) }}
                    />
                    <span>{event.ClimateTechSector}</span>
                  </div>
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
                  {event.LeadInvestors ? event.LeadInvestors.split(',').map((investor, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-sm">
                      {investor.trim()}
                    </span>
                  )) : (
                    <span className="px-2 py-1 bg-gray-800 rounded text-sm">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedEvent === event.EventID && (
              <div className="border-t border-gray-700 p-6 bg-gray-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.Tags ? event.Tags.split(',').map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                          {tag.trim()}
                        </span>
                      )) : (
                        <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">No tags</span>
                      )}
                    </div>
                  </div>

                  <div>
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
                      <span className="text-gray-400">No source available</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}