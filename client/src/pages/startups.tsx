import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import { InvestorCard } from "@/components/investor-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Building2, 
  Target, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  Users,
  MapPin,
  HelpCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSectorColor, getStageColor } from "@/lib/color-schemes";

// Use the same API function you already have
const fetchInvestors = async () => {
  const response = await fetch('/api/investors/timeline?pageSize=1000'); // Get all investors for startups page
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.investors || []; // Extract investors array from paginated response
};

export default function StartupsPage() {
  const [startupProfile, setStartupProfile] = useState({
    sector: "",
    fundingStage: "",
    fundingNeeded: "",
    teamSize: "" // Replace location with teamSize
  });

  const [showMatching, setShowMatching] = useState(false);

  // Use your existing investor data
  const { data: investors = [], isLoading, isError } = useQuery({
    queryKey: ['investors'],
    queryFn: fetchInvestors,
  });

  // Simple matching logic using your existing data structure
  const matchingInvestors = useMemo(() => {
    if (!startupProfile.sector && !startupProfile.fundingStage && !startupProfile.fundingNeeded && !startupProfile.teamSize) {
      return investors;
    }

    return investors.filter(investor => {
      // Safety check for investments array
      if (!investor || !investor.investments || !Array.isArray(investor.investments)) {
        return false;
      }

      let match = true;

      // Match by sector (if investor has investments in that sector)
      if (startupProfile.sector && startupProfile.sector !== "all") {
        const hasSectorInvestment = investor.investments.some((inv: any) => 
          inv.sector === startupProfile.sector || 
          inv.companyName?.toLowerCase().includes(startupProfile.sector.toLowerCase())
        );
        if (!hasSectorInvestment) match = false;
      }

      // Match by funding stage
      if (startupProfile.fundingStage && startupProfile.fundingStage !== "all") {
        const hasStageInvestment = investor.investments.some((inv: any) => 
          inv.stage === startupProfile.fundingStage
        );
        if (!hasStageInvestment) match = false;
      }

      // Fix the funding size matching logic
      if (startupProfile.fundingNeeded && startupProfile.fundingNeeded !== "all") {
        // Use individual investment amounts instead of total/average
        const validInvestments = investor.investments.filter(inv => inv.amount > 0);
        const avgInvestment = validInvestments.length > 0 
          ? validInvestments.reduce((sum, inv) => sum + inv.amount, 0) / validInvestments.length
          : 0;
        
        let sizeMatch = false;
        switch (startupProfile.fundingNeeded) {
          case "small":
            sizeMatch = avgInvestment >= 1 && avgInvestment <= 5; // $1M - $5M
            break;
          case "medium":
            sizeMatch = avgInvestment >= 5 && avgInvestment <= 20; // $5M - $20M
            break;
          case "large":
            sizeMatch = avgInvestment >= 20 && avgInvestment <= 100; // $20M - $100M
            break;
          case "mega":
            sizeMatch = avgInvestment >= 100; // $100M+
            break;
        }
        if (!sizeMatch) match = false;
      }

      // Improve team size matching with better heuristics
      if (startupProfile.teamSize && startupProfile.teamSize !== "all") {
        // Look at actual investment patterns, not just stage ratios
        const recentInvestments = investor.investments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10); // Last 10 investments
        
        const earlyStageRecent = recentInvestments.filter(inv => 
          inv.stage === "Seed" || inv.stage === "Series A"
        ).length;
        
        const recentRatio = recentInvestments.length > 0 ? earlyStageRecent / recentInvestments.length : 0;
        
        let teamSizeMatch = false;
        switch (startupProfile.teamSize) {
          case "solo":
            teamSizeMatch = recentRatio >= 0.8; // 80%+ recent early-stage
            break;
          case "small":
            teamSizeMatch = recentRatio >= 0.6; // 60%+ recent early-stage
            break;
          case "medium":
            teamSizeMatch = recentRatio >= 0.4; // 40%+ recent early-stage
            break;
          case "large":
            teamSizeMatch = recentRatio < 0.4; // Focus on later stages
            break;
        }
        if (!teamSizeMatch) match = false;
      }

      return match;
    });
  }, [investors, startupProfile]);

  const updateProfile = (field: string, value: string) => {
    setStartupProfile(prev => ({ ...prev, [field]: value }));
  };

  const getMatchScore = (investor: any) => {
    // Safety check for investments array
    if (!investor || !investor.investments || !Array.isArray(investor.investments)) {
      return 0;
    }

    let score = 0;
    let total = 0;

    if (startupProfile.sector && startupProfile.sector !== "all") {
      total++;
      const hasSectorInvestment = investor.investments.some((inv: any) => 
        inv.sector === startupProfile.sector || 
        inv.companyName?.toLowerCase().includes(startupProfile.sector.toLowerCase())
      );
      if (hasSectorInvestment) score++;
    }

    if (startupProfile.fundingStage && startupProfile.fundingStage !== "all") {
      total++;
      const hasStageInvestment = investor.investments.some((inv: any) => 
        inv.stage === startupProfile.fundingStage
      );
      if (hasStageInvestment) score++;
    }

    if (startupProfile.fundingNeeded && startupProfile.fundingNeeded !== "all") {
      total++;
      const avgInvestment = investor.totalInvested / investor.investmentCount;
      const fundingNeeded = startupProfile.fundingNeeded;
      
      let sizeMatch = false;
      switch (fundingNeeded) {
        case "small":
          sizeMatch = avgInvestment >= 1000000 && avgInvestment <= 5000000;
          break;
        case "medium":
          sizeMatch = avgInvestment >= 5000000 && avgInvestment <= 20000000;
          break;
        case "large":
          sizeMatch = avgInvestment >= 20000000 && avgInvestment <= 100000000;
          break;
          case "mega":
          sizeMatch = avgInvestment >= 100000000;
          break;
      }
      if (sizeMatch) score++;
    }

    if (startupProfile.teamSize && startupProfile.teamSize !== "all") {
      total++;
      const earlyStageCount = investor.investments.filter((inv: any) => 
        inv.stage === "Seed" || inv.stage === "Series A"
      ).length;
      const totalInvestments = investor.investments.length;
      const earlyStageRatio = totalInvestments > 0 ? earlyStageCount / totalInvestments : 0;
      
      let teamSizeMatch = false;
      switch (startupProfile.teamSize) {
        case "solo":
          teamSizeMatch = earlyStageRatio >= 0.7;
          break;
        case "small":
          teamSizeMatch = earlyStageRatio >= 0.5;
          break;
        case "medium":
          teamSizeMatch = earlyStageRatio >= 0.3;
          break;
        case "large":
          teamSizeMatch = earlyStageRatio < 0.5;
          break;
      }
      if (teamSizeMatch) score++;
    }

    return total > 0 ? Math.round((score / total) * 100) : 100;
  };

  // Add error handling after all hooks are defined
  if (isError) {
    return (
      <NavbarSidebarLayout>
        <div className="w-full px-8 md:px-12 py-8">
          <div className="text-center text-red-400">
            <p>Error loading investor data. Please try again later.</p>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  if (isLoading) {
    return (
      <NavbarSidebarLayout>
        <div className="w-full px-8 md:px-12 py-8">
          <div className="text-center text-gray-400">
            <p>Loading investor data...</p>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout>
      <div className="w-full px-8 md:px-12 py-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Startup-Investor Matching</h1>
          <p className="text-gray-400">
            Tell us about your startup to find the best climate tech investors
          </p>
          
          {/* Disclaimer */}
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-400 text-xs font-bold">!</span>
              </div>
              <div className="text-sm text-amber-200">
                <p className="font-medium mb-1">Matching Algorithm Disclaimer</p>
                <p className="text-amber-300/80">
                  Our matching algorithm uses investment history data to find relevant investors. 
                  While we strive for accuracy, matches are based on historical patterns and may not 
                  reflect current investment preferences. Always conduct your own research and reach 
                  out directly to investors for the most up-to-date information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Startup Profile Form */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[var(--botanical-green)]" />
                  Your Startup
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Quick profile to find matching investors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Climate Tech Sector</label>
                  <Select value={startupProfile.sector} onValueChange={(value) => updateProfile('sector', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select sector" />
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
                      <SelectItem value="Mobility" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                            style={{ 
                              backgroundColor: getSectorColor('Mobility'),
                              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                            }}
                          />
                          <span>Mobility</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Food" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                            style={{ 
                              backgroundColor: getSectorColor('Food'),
                              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                            }}
                          />
                          <span>Food</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Agriculture" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                            style={{ 
                              backgroundColor: getSectorColor('Agriculture'),
                              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                            }}
                          />
                          <span>Agriculture</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Carbon Removal" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                            style={{ 
                              backgroundColor: getSectorColor('Carbon Removal'),
                              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                            }}
                          />
                          <span>Carbon Removal</span>
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
                      <SelectItem value="Circular Fashion" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                            style={{ 
                              backgroundColor: getSectorColor('Circular Fashion'),
                              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                            }}
                          />
                          <span>Circular Fashion</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Insurance" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg" 
                            style={{ 
                              backgroundColor: getSectorColor('Insurance'),
                              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)`
                            }}
                          />
                          <span>Insurance</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Funding Stage */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Funding Stage</label>
                  <Select value={startupProfile.fundingStage} onValueChange={(value) => updateProfile('fundingStage', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select stage" />
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

                {/* Funding Needed */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Funding Needed</label>
                  <Select value={startupProfile.fundingNeeded} onValueChange={(value) => updateProfile('fundingNeeded', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">Any Amount</SelectItem>
                      <SelectItem value="small" className="text-white hover:bg-gray-700 focus:bg-gray-700">$1M - $5M</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-gray-700 focus:bg-gray-700">$5M - $20M</SelectItem>
                      <SelectItem value="large" className="text-white hover:bg-gray-700 focus:bg-gray-700">$20M - $100M</SelectItem>
                      <SelectItem value="mega" className="text-white hover:bg-gray-700 focus:bg-gray-700">$100M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Size */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Team Size</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-600 text-gray-200 max-w-xs">
                          <p>Find investors who typically work with companies at your team size. Early-stage investors often prefer smaller teams they can mentor, while later-stage investors look for established teams with proven execution.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={startupProfile.teamSize} onValueChange={(value) => updateProfile('teamSize', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">Any Size</SelectItem>
                      <SelectItem value="solo" className="text-white hover:bg-gray-700 focus:bg-gray-700">Solo Founder</SelectItem>
                      <SelectItem value="small" className="text-white hover:bg-gray-700 focus:bg-gray-700">2-10 People</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-gray-700 focus:bg-gray-700">11-50 People</SelectItem>
                      <SelectItem value="large" className="text-white hover:bg-gray-700 focus:bg-gray-700">50+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Find Investors Button */}
                <Button
                  onClick={() => setShowMatching(true)}
                  className="w-full bg-[var(--botanical-green)] hover:bg-[var(--botanical-dark)] text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Matching Investors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Investor Results */}
          <div className="lg:col-span-3">
            {!showMatching ? (
              <Card className="bg-gray-900/50 border-gray-700 h-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-400">
                    <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p>Fill out your startup profile and click "Find Matching Investors"</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Matching Investors</h2>
                    <p className="text-gray-400">
                      Found {matchingInvestors.length} investors matching your criteria
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowMatching(false)}
                    className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800/30 hover:text-gray-300 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Adjust Criteria
                  </Button>
                </div>

                {/* Match Calculation Info */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-300">How Match Scores Are Calculated</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-600 text-gray-200 max-w-md">
                            <div className="space-y-2">
                              <p className="font-medium">Match Score Calculation:</p>
                              <ul className="text-sm space-y-1">
                                <li>• <strong>Sector:</strong> Investor has invested in companies in your sector</li>
                                <li>• <strong>Stage:</strong> Investor has made investments at your funding stage</li>
                                <li>• <strong>Funding Size:</strong> Investor's average check size matches your needs</li>
                                <li>• <strong>Team Size:</strong> Investor's portfolio suggests preference for your team size</li>
                              </ul>
                              <p className="text-xs text-gray-400 mt-2">
                                Score = (Matching Criteria / Total Criteria) × 100%
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="text-center">
                        <div className="text-green-400 font-medium">80-100%</div>
                        <div className="text-gray-400">Excellent Match</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-medium">60-79%</div>
                        <div className="text-gray-400">Good Match</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-400 font-medium">40-59%</div>
                        <div className="text-gray-400">Fair Match</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 font-medium">0-39%</div>
                        <div className="text-gray-400">Limited Match</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investor Cards */}
                {matchingInvestors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchingInvestors.map((investor) => {
                      const matchScore = getMatchScore(investor);
                      return (
                        <div key={investor.id} className="relative">
                          {/* Match Score Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className={`${
                              matchScore >= 80 ? 'bg-green-600' : 
                              matchScore >= 60 ? 'bg-yellow-600' : 
                              matchScore >= 40 ? 'bg-orange-600' : 'bg-gray-600'
                            } text-white`}>
                              {matchScore}% Match
                            </Badge>
                          </div>
                          
                          {/* Use your existing InvestorCard component with added top margin */}
                          <div className="mt-12">
                            <InvestorCard 
                              investor={investor}
                              globalMaxInvestment={750}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardContent className="flex items-center justify-center h-32">
                      <div className="text-center text-gray-400">
                        <p>No investors match your current criteria</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
} 