import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import { InvestorCard } from "@/components/investor-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Target, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  Users,
  MapPin
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
    location: ""
  });

  const [showMatching, setShowMatching] = useState(false);

  // Use your existing investor data
  const { data: investors = [], isLoading, isError } = useQuery({
    queryKey: ['investors'],
    queryFn: fetchInvestors,
  });

  // Simple matching logic using your existing data structure
  const matchingInvestors = useMemo(() => {
    if (!startupProfile.sector && !startupProfile.fundingStage && !startupProfile.fundingNeeded) {
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

      // Match by funding size (based on average investment)
      if (startupProfile.fundingNeeded && startupProfile.fundingNeeded !== "all") {
        const avgInvestment = investor.totalInvested && investor.investmentCount 
          ? investor.totalInvested / investor.investmentCount 
          : 0;
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
        if (!sizeMatch) match = false;
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

                {/* Funding Stage */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Funding Stage</label>
                  <Select value={startupProfile.fundingStage} onValueChange={(value) => updateProfile('fundingStage', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select stage" />
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

                {/* Funding Needed */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Funding Needed</label>
                  <Select value={startupProfile.fundingNeeded} onValueChange={(value) => updateProfile('fundingNeeded', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Amount</SelectItem>
                      <SelectItem value="small">$1M - $5M</SelectItem>
                      <SelectItem value="medium">$5M - $20M</SelectItem>
                      <SelectItem value="large">$20M - $100M</SelectItem>
                      <SelectItem value="mega">$100M+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Location (Optional)</label>
                  <Input
                    placeholder="City, Country"
                    value={startupProfile.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
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
                              matchScore >= 60 ? 'bg-yellow-600' : 'bg-gray-600'
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