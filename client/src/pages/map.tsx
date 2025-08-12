import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { ZoomIn, ZoomOut, RotateCcw, ExternalLink, Calendar, DollarSign, Building2, MapPin } from "lucide-react";

// Type definition for funding events
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

// countryCentroids: { [country]: [lon, lat] }
const countryCentroids: Record<string, [number, number]> = {
  "USA": [-95.7129, 37.0902],
  "United States": [-95.7129, 37.0902],
  "Canada": [-106.3468, 56.1304],
  "Mexico": [-102.5000, 23.6333],
  "Brazil": [-51.9253, -14.2350],
  "Argentina": [-64.1811, -31.4135],
  "Chile": [-70.6693, -33.4489],
  "Colombia": [-74.0721, 4.7110],
  "Peru": [-75.0152, -9.1900],
  "Venezuela": [-66.5852, 10.4687],
  "UK": [-0.1276, 51.5074],
  "United Kingdom": [-0.1276, 51.5074],
  "England": [-0.1276, 51.5074],
  "Germany": [10.4515, 51.1657],
  "France": [2.2137, 46.2276],
  "Spain": [-3.7038, 40.4168],
  "Italy": [12.5674, 41.9028],
  "Netherlands": [5.7167, 52.0667],
  "Sweden": [18.0686, 60.1282],
  "Norway": [10.7200, 60.4720],
  "Finland": [24.9384, 60.1920],
  "Poland": [19.1451, 51.9194],
  "Switzerland": [7.4600, 46.9170],
  "Russia": [105.3188, 61.5240],
  "China": [106.5511, 29.5630],
  "Japan": [139.6917, 35.6895],
  "South Korea": [127.7669, 35.9077],
  "India": [77.2167, 28.6448],
  "Indonesia": [113.9213, -0.7893],
  "Thailand": [100.9925, 15.8700],
  "Vietnam": [108.2200, 14.0583],
  "Philippines": [121.0000, 13.0000],
  "Singapore": [103.8198, 1.3521],
  "Malaysia": [101.6869, 2.9333],
  "South Africa": [22.9375, -29.1244],
  "Nigeria": [7.4962, 9.0820],
  "Kenya": [37.9062, -0.0236],
  "Egypt": [31.2333, 26.8206],
  "Morocco": [-7.0900, 31.7900],
  "Ghana": [-1.6500, 10.4500],
  "Ethiopia": [38.7500, 9.1500],
  "Israel": [34.7806, 31.0461],
  "UAE": [53.8478, 23.7094],
  "Saudi Arabia": [45.0792, 24.6849],
  "Turkey": [35.2433, 38.9637],
  "Australia": [133.7751, -25.2744],
  "New Zealand": [174.7633, -41.2900],
};

// Fetch funding events
const fetchFundingEvents = async (): Promise<FundingEvent[]> => {
  const response = await fetch('/api/events/search');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export default function MapPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [showAllTop, setShowAllTop] = useState(false);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [showDetailedEvents, setShowDetailedEvents] = useState(false);

  // Fetch funding events data
  const { data: fundingEvents = [], isLoading, isError } = useQuery<FundingEvent[]>({
    queryKey: ['fundingEvents'],
    queryFn: fetchFundingEvents,
  });

  // Aggregate data by country
  const countryData = useMemo(() => {
    const aggregated: Record<string, {
      count: number;
      totalFunding: number;
      avgFunding: number;
      sectors: Record<string, number>;
      companies: string[];
      events: FundingEvent[];
      recentEvents: FundingEvent[];
      topSectors: Array<{ sector: string; count: number; funding: number }>;
    }> = {};

    fundingEvents.forEach(event => {
      const country = event.Country;
      if (!country) return;

      if (!aggregated[country]) {
        aggregated[country] = {
          count: 0,
          totalFunding: 0,
          avgFunding: 0,
          sectors: {},
          companies: [],
          events: [],
          recentEvents: [],
          topSectors: []
        };
      }

      aggregated[country].count += 1;
      // Handle null/undefined amounts properly
      const amount = event.AmountRaisedUSD || 0;
      aggregated[country].totalFunding += amount;
      aggregated[country].companies.push(event.CompanyName);
      aggregated[country].events.push(event);
      
      if (event.ClimateTechSector) {
        if (!aggregated[country].sectors[event.ClimateTechSector]) {
          aggregated[country].sectors[event.ClimateTechSector] = 0;
        }
        aggregated[country].sectors[event.ClimateTechSector] += 1;
      }
    });

    // Calculate derived data
    Object.keys(aggregated).forEach(country => {
      const data = aggregated[country];
      data.avgFunding = data.count > 0 ? data.totalFunding / data.count : 0;
      
      // Sort events by date and amount for recent events
      data.recentEvents = data.events
        .sort((a, b) => {
          const dateA = new Date(b.FundingDate || '1970-01-01').getTime();
          const dateB = new Date(a.FundingDate || '1970-01-01').getTime();
          return dateA - dateB;
        })
        .slice(0, 5);
      
      // Calculate top sectors with funding
      data.topSectors = Object.entries(data.sectors)
        .map(([sector, count]) => {
          const sectorFunding = data.events
            .filter(e => e.ClimateTechSector === sector)
            .reduce((sum, e) => sum + (e.AmountRaisedUSD || 0), 0);
          return { sector, count, funding: sectorFunding };
        })
        .sort((a, b) => b.funding - a.funding)
        .slice(0, 3);
    });

    return aggregated;
  }, [fundingEvents]);

  // Get size and color for country markers
  const getMarkerProps = (country: string) => {
    const data = countryData[country];
    if (!data) return { size: 0, color: '#1f2937', opacity: 0 };

    // Base size calculation based on event count
    const baseSize = Math.min(Math.max(data.count * 2, 6), 25);
    
    // Adjust size based on zoom level - smaller dots when zoomed in
    const zoomFactor = Math.max(0.3, 1 / position.zoom);
    const adjustedSize = baseSize * zoomFactor;
    
    const intensity = Math.min(data.totalFunding / 50000000, 1);
    
    return {
      size: adjustedSize,
      color: `#10b981`,
      opacity: 0.7 + intensity * 0.3,
      glow: intensity > 0.5
    };
  };

  // All countries sorted by funding
  const sortedCountries = useMemo(() => {
    return Object.entries(countryData)
      .sort(([, a], [, b]) => b.totalFunding - a.totalFunding);
  }, [countryData]);

  // Handle zoom controls
  const handleZoomIn = () => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.5, 8)
    }));
  };

  const handleZoomOut = () => {
    setPosition(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.5, 1)
    }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  // Handle move end for zoom with complete pan boundaries
  function handleMoveEnd(position: any) {
    // Define pan boundaries to prevent infinite dragging in ALL directions
    const maxLat = 75; // Maximum latitude (above Arctic)
    const minLat = -60; // Minimum latitude (below Antarctica)
    const maxLon = 180; // Maximum longitude (right edge)
    const minLon = -180; // Minimum longitude (left edge)
    
    // Get current zoom level to adjust boundaries
    const currentZoom = position.zoom;
    
    // Calculate dynamic boundaries based on zoom level
    // At higher zoom, allow more panning; at lower zoom, restrict more
    const zoomFactor = Math.max(1, currentZoom - 1);
    const latBuffer = 15 / zoomFactor; // More restrictive at low zoom
    const lonBuffer = 30 / zoomFactor; // More restrictive at low zoom
    
    // Apply zoom-based boundaries
    const effectiveMaxLat = maxLat - latBuffer;
    const effectiveMinLat = minLat + latBuffer;
    const effectiveMaxLon = maxLon - lonBuffer;
    const effectiveMinLon = minLon + lonBuffer;
    
    // Clamp coordinates to boundaries
    const clampedCoords = [
      Math.max(effectiveMinLon, Math.min(effectiveMaxLon, position.coordinates[0]) as number),
      Math.max(effectiveMinLat, Math.min(effectiveMaxLat, position.coordinates[1]) as number)
    ];
    
    // Update position with clamped coordinates
    setPosition({
      ...position,
      coordinates: clampedCoords
    });
  }

  // Get events for selected country
  const selectedCountryEvents = selectedCountry ? countryData[selectedCountry]?.events || [] : [];
  const selectedCountryData = selectedCountry ? countryData[selectedCountry] : null;

  // Format currency - handle null/undefined values
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount || amount === null || amount === undefined || isNaN(amount)) {
      return '$0';
    }
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <NavbarSidebarLayout>
        <div className="flex items-center justify-center h-full min-h-[80vh]">
          <div className="text-[var(--botanical-green)] text-xl">Loading map data...</div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout>
      <div className="bg-black text-white p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Global Climate Tech Map</h1>
          <p className="text-gray-400">
            Interactive visualization of climate tech funding activity worldwide • {fundingEvents.length} events • Use mouse wheel to zoom and drag to pan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Statistics Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Global Statistics</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Events</p>
                  <p className="text-2xl font-bold text-[var(--botanical-green)]">
                    {fundingEvents.length.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Total Funding</p>
                  <p className="text-2xl font-bold text-[var(--botanical-green)]">
                    {formatCurrency(fundingEvents.reduce((sum, event) => sum + (event.AmountRaisedUSD || 0), 0))}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Active Countries</p>
                  <p className="text-2xl font-bold text-[var(--botanical-green)]">
                    {Object.keys(countryData).length}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Zoom Level</p>
                  <p className="text-lg font-semibold text-[var(--botanical-green)]">
                    {position.zoom.toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">Top Countries</h4>
              <div className={`space-y-2 ${showAllTop ? 'max-h-48 overflow-y-auto pr-2' : 'max-h-32 overflow-hidden'}`}>
                {(showAllTop ? sortedCountries : sortedCountries.slice(0, 3)).map(([country, data]) => (
                  <div 
                    key={country}
                    className="flex justify-between items-center p-2 hover:bg-gray-800/50 rounded cursor-pointer transition-colors"
                    onClick={() => setSelectedCountry(country)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMarkerProps(country).color }}
                      />
                      <span className="text-white text-sm">{country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[var(--botanical-green)] text-sm font-semibold">
                        {formatCurrency(data.totalFunding)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {data.count} events
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-2 text-xs text-gray-300 hover:text-white underline transition-colors"
                onClick={() => setShowAllTop(v => !v)}
              >
                {showAllTop ? 'Show less' : 'Show all'}
              </button>
            </div>

            {/* Selected Country Details */}
            {selectedCountry && selectedCountryData && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--botanical-green)]" />
                  {selectedCountry}
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total Events</p>
                      <p className="text-xl font-bold text-[var(--botanical-green)]">
                        {selectedCountryData.count}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Funding</p>
                      <p className="text-xl font-bold text-[var(--botanical-green)]">
                        {formatCurrency(selectedCountryData.totalFunding)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Average per Event</p>
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(selectedCountryData.avgFunding)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Top Sectors</p>
                    <div className="space-y-1">
                      {selectedCountryData.topSectors.slice(0, 3).map(({ sector, count, funding }) => (
                        <div key={sector} className="flex justify-between items-center text-xs">
                          <span className="text-[var(--botanical-green)]">{sector}</span>
                          <span className="text-gray-400">{count} • {formatCurrency(funding)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4 h-[500px] relative overflow-hidden">
              {/* Interactive Map Hint */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-[var(--botanical-green)]/90 backdrop-blur-sm border border-[var(--botanical-green)] rounded-lg p-3 shadow-lg animate-pulse">
                  <div className="flex items-center gap-2 text-white text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>Click countries to see details</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Zoom Controls */}
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-xl p-2 shadow-2xl">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleZoomIn}
                      className="bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white p-3 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
                      title="Zoom In (+)"
                      aria-label="Zoom In"
                    >
                      <ZoomIn className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="bg-[var(--botanical-green)] hover:bg-[botanical-dark)] text-white p-3 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
                      title="Zoom Out (-)"
                      aria-label="Zoom Out"
                    >
                      <ZoomOut className="w-6 h-6" />
                    </button>
                    <div className="border-t border-gray-600 my-1"></div>
                    <button
                      onClick={handleReset}
                      className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl"
                      title="Reset View"
                      aria-label="Reset Map View"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Interaction Guide */}
              <div className="absolute bottom-6 left-6 z-10">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-3 text-gray-300 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[var(--botanical-green)] rounded-full animate-pulse"></div>
                      <span>Hover for preview</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Click for details</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span>Scroll to zoom</span>
                    </div>
                  </div>
                </div>
              </div>

              <ComposableMap 
                projection="geoMercator" 
                width={800} 
                height={450} 
                style={{ background: "transparent" }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates as [number, number]}
                  onMoveEnd={handleMoveEnd}
                  maxZoom={8}
                  minZoom={1}
                >
                  <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography 
                          key={geo.rsmKey} 
                          geography={geo} 
                          fill="#111827" 
                          stroke="#374151"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#1f2937", outline: "none" },
                            pressed: { outline: "none" }
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Country markers */}
                  {Object.entries(countryCentroids).map(([country, coords]) => {
                    const m = getMarkerProps(country);
                    if (!m.size) return null;
                    return (
                      <Marker
                        key={country}
                        coordinates={coords}
                        onMouseEnter={() => setHoveredCountry(country)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => setSelectedCountry(country)}
                      >
                        {m.glow && <circle r={m.size + 8} fill={m.color} opacity={0.2} />}
                        {hoveredCountry === country && (
                          <circle r={m.size + 4} fill="none" stroke="#10b981" strokeWidth={2} strokeOpacity={0.8} />
                        )}
                        <circle 
                          r={m.size} 
                          fill={m.color} 
                          opacity={m.opacity} 
                          className="cursor-pointer transition-all duration-200 hover:opacity-100" 
                        />
                        <title>{country}</title>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>

              {/* Enhanced Tooltip */}
              {hoveredCountry && countryData[hoveredCountry] && (
                <div className="absolute bottom-4 right-4 bg-gray-900/95 border border-gray-600 rounded-lg p-4 shadow-xl max-w-sm backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--botanical-green)]" />
                    {hoveredCountry}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Events:</span>
                      <span className="text-[var(--botanical-green)] font-semibold">
                        {countryData[hoveredCountry].count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Funding:</span>
                      <span className="text-[var(--botanical-green)] font-semibold">
                        {formatCurrency(countryData[hoveredCountry].totalFunding)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Avg per Event:</span>
                      <span className="text-[var(--botanical-green)] font-semibold">
                        {formatCurrency(countryData[hoveredCountry].avgFunding)}
                      </span>
                    </div>
                    
                    {showDetailedEvents && countryData[hoveredCountry].recentEvents.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <p className="text-gray-300 text-xs mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Recent Events:
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {countryData[hoveredCountry].recentEvents.slice(0, 3).map((event, index) => (
                            <div key={index} className="text-xs bg-gray-800/70 p-2 rounded">
                              <div className="font-medium text-[var(--botanical-green)] flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {event.CompanyName}
                              </div>
                              <div className="text-gray-300 flex items-center gap-1 mt-1">
                                <DollarSign className="w-3 h-3" />
                                {formatCurrency(event.AmountRaisedUSD)} • {event.FundingStage}
                              </div>
                              <div className="text-gray-400">{event.ClimateTechSector}</div>
                              <div className="text-gray-500">{formatDate(event.FundingDate)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Country Events List */}
            {selectedCountry && selectedCountryEvents.length > 0 && (
              <div className="mt-4 bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--botanical-green)]" />
                  Funding Events in {selectedCountry}
                  <span className="text-sm text-gray-400">({selectedCountryEvents.length} total)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                  {selectedCountryEvents
                    .sort((a, b) => (b.AmountRaisedUSD || 0) - (a.AmountRaisedUSD || 0))
                    .map((event, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
                      <div className="font-medium text-[var(--botanical-green)] text-sm mb-2 flex items-start justify-between">
                        <span className="flex-1">{event.CompanyName}</span>
                        {event.SourceURL && (
                          <a 
                            href={event.SourceURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[var(--botanical-green)] ml-2"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      
                      <div className="text-white text-lg font-bold mb-1">
                        {formatCurrency(event.AmountRaisedUSD)}
                      </div>
                      
                      <div className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.FundingStage} • {formatDate(event.FundingDate)}
                      </div>
                      
                      <div className="text-gray-500 text-xs mb-2">
                        {event.ClimateTechSector}
                      </div>
                      
                      {event.LeadInvestors && (
                        <div className="text-gray-400 text-xs mb-2">
                          <strong>Lead:</strong> {event.LeadInvestors}
                        </div>
                      )}
                      
                      {event.Problem && (
                        <div className="text-gray-500 text-xs">
                          <strong>Problem:</strong> {event.Problem.slice(0, 80)}
                          {event.Problem.length > 80 && '...'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
} 