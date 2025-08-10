import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

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

// Updated country coordinates for positioning markers on the map
const countryPositions: Record<string, { x: number; y: number }> = {
  // North America
  "USA": { x: 200, y: 180 },
  "United States": { x: 200, y: 180 },
  "Canada": { x: 180, y: 120 },
  "Mexico": { x: 170, y: 220 },
  
  // South America
  "Brazil": { x: 260, y: 320 },
  "Argentina": { x: 250, y: 400 },
  "Chile": { x: 240, y: 380 },
  "Colombia": { x: 230, y: 280 },
  "Peru": { x: 230, y: 320 },
  "Venezuela": { x: 240, y: 260 },
  
  // Europe
  "UK": { x: 420, y: 140 },
  "United Kingdom": { x: 420, y: 140 },
  "England": { x: 420, y: 140 },
  "Germany": { x: 460, y: 140 },
  "France": { x: 440, y: 160 },
  "Spain": { x: 420, y: 180 },
  "Italy": { x: 460, y: 180 },
  "Netherlands": { x: 450, y: 130 },
  "Sweden": { x: 470, y: 100 },
  "Norway": { x: 460, y: 90 },
  "Finland": { x: 490, y: 100 },
  "Poland": { x: 480, y: 140 },
  "Switzerland": { x: 450, y: 160 },
  
  // Asia
  "Russia": { x: 580, y: 120 },
  "China": { x: 620, y: 200 },
  "Japan": { x: 680, y: 180 },
  "South Korea": { x: 660, y: 180 },
  "India": { x: 580, y: 240 },
  "Indonesia": { x: 620, y: 280 },
  "Thailand": { x: 600, y: 260 },
  "Vietnam": { x: 610, y: 240 },
  "Philippines": { x: 640, y: 260 },
  "Singapore": { x: 610, y: 280 },
  "Malaysia": { x: 600, y: 270 },
  
  // Africa
  "South Africa": { x: 480, y: 380 },
  "Nigeria": { x: 440, y: 280 },
  "Kenya": { x: 500, y: 300 },
  "Egypt": { x: 480, y: 220 },
  "Morocco": { x: 420, y: 220 },
  "Ghana": { x: 430, y: 280 },
  "Ethiopia": { x: 510, y: 280 },
  
  // Middle East
  "Israel": { x: 490, y: 220 },
  "UAE": { x: 520, y: 240 },
  "Saudi Arabia": { x: 500, y: 240 },
  "Turkey": { x: 490, y: 180 },
  
  // Oceania
  "Australia": { x: 660, y: 380 },
  "New Zealand": { x: 710, y: 420 },
};

// countryCentroids: { [country]: [lon, lat] }
const countryCentroids: Record<string, [number, number]> = {
  "USA": [-95.7129, 37.0902],
  "United States": [-95.7129, 37.0902],
  "Canada": [-95.7129, 37.0902],
  "Mexico": [-102.5000, 23.6333],
  "Brazil": [-51.9253, -14.2350],
  "Argentina": [-64.1811, -31.4135],
  "Chile": [-70.6693, -33.4489],
  "Colombia": [-74.0721, 4.7110],
  "Peru": [-74.0721, 4.7110],
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
          companies: []
        };
      }

      aggregated[country].count += 1;
      aggregated[country].totalFunding += event.AmountRaisedUSD || 0;
      aggregated[country].companies.push(event.CompanyName);
      
      if (event.ClimateTechSector) {
        aggregated[country].sectors[event.ClimateTechSector] = 
          (aggregated[country].sectors[event.ClimateTechSector] || 0) + 1;
      }
    });

    // Calculate averages
    Object.keys(aggregated).forEach(country => {
      aggregated[country].avgFunding = 
        aggregated[country].totalFunding / aggregated[country].count;
    });

    return aggregated;
  }, [fundingEvents]);

  // Get size and color for country markers
  const getMarkerProps = (country: string) => {
    const data = countryData[country];
    if (!data) return { size: 0, color: '#1f2937', opacity: 0 };

    const size = Math.min(Math.max(data.count * 3, 8), 30);
    const intensity = Math.min(data.totalFunding / 50000000, 1);
    
    return {
      size,
      color: `#10b981`,
      opacity: 0.8 + intensity * 0.2,
      glow: intensity > 0.5
    };
  };

  // All countries sorted by funding (we'll slice in render)
  const sortedCountries = useMemo(() => {
    return Object.entries(countryData)
      .sort(([, a], [, b]) => b.totalFunding - a.totalFunding);
  }, [countryData]);

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
            Interactive visualization of climate tech funding activity worldwide • {fundingEvents.length} events
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
                    ${(fundingEvents.reduce((sum, event) => sum + (event.AmountRaisedUSD || 0), 0) / 1000000000).toFixed(1)}B
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Active Countries</p>
                  <p className="text-2xl font-bold text-[var(--botanical-green)]">
                    {Object.keys(countryData).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-4">Top Countries</h4>
              <div className={`space-y-3 ${showAllTop ? 'max-h-64 overflow-y-auto pr-1' : ''}`}>
                {(showAllTop ? sortedCountries : sortedCountries.slice(0, 3)).map(([country, data]) => (
                  <div 
                    key={country}
                    className="flex justify-between items-center p-2 hover:bg-gray-800/50 rounded cursor-pointer"
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
                        ${(data.totalFunding / 1000000).toFixed(0)}M
                      </div>
                      <div className="text-gray-400 text-xs">
                        {data.count} events
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 text-xs text-gray-300 hover:text-white underline"
                onClick={() => setShowAllTop(v => !v)}
              >
                {showAllTop ? 'Show less' : 'Show all'}
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4 h-[440px] relative overflow-hidden">
              <ComposableMap projection="geoMercator" width={800} height={380} style={{ background: "transparent" }}>
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography key={geo.rsmKey} geography={geo} fill="#111827" stroke="#374151" />
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
                      coordinates={coords as [number, number]}
                      onMouseEnter={() => setHoveredCountry(country)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setSelectedCountry(country)}
                    >
                      {m.glow && <circle r={m.size + 10} fill={m.color} opacity={0.3} />}
                      {/* hover ring */}
                      {hoveredCountry === country && (
                        <circle r={m.size + 6} fill="none" stroke="#10b981" strokeWidth={2} strokeOpacity={0.6} />
                      )}
                      <circle r={m.size} fill={m.color} opacity={m.opacity} className="cursor-pointer" />
                      <title>{country}</title>
                    </Marker>
                  );
                })}
              </ComposableMap>

              {/* Tooltip */}
              {hoveredCountry && countryData[hoveredCountry] && (
                <div className="absolute top-4 right-4 bg-gray-900 border border-gray-600 rounded-lg p-4 shadow-lg">
                  <h4 className="text-white font-semibold mb-2">{hoveredCountry}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-300">
                      Events: <span className="text-[var(--botanical-green)]">{countryData[hoveredCountry].count}</span>
                    </div>
                    <div className="text-gray-300">
                      Total Funding: <span className="text-[var(--botanical-green)]">
                        ${(countryData[hoveredCountry].totalFunding / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="text-gray-300">
                      Avg per Event: <span className="text-[var(--botanical-green)]">
                        ${(countryData[hoveredCountry].avgFunding / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
} 