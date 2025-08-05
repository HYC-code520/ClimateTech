import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import homeBg from "@assets/home-bg_1754320407119.png";
import earthClimateImage from "@assets/earth-climate-image.png";

export default function AboutPage() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleSignUp = () => {
    setLocation("/signup");
  };

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Navigation Header */}
        <header className="relative z-50 px-8 md:px-12 py-8 flex items-center justify-between flex-shrink-0">
          {/* Left Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setLocation("/funding-tracker")}
              className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
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
              className="text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors font-medium"
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

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto px-8 md:px-16 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section with Image and Title */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Left Side - Earth Climate Image */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src={earthClimateImage} 
                    alt="Earth surrounded by green foliage representing climate and environmental consciousness"
                    className="w-full h-[400px] object-cover rounded-2xl"
                  />
                  {/* Optional overlay for better text contrast if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>

              {/* Right Side - Main Title and Description */}
              <div className="lg:pl-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight font-light mb-8">
                  🌿 About EcoLens
                </h1>
                
                {/* Content Box */}
                <div className="border border-[var(--botanical-green)] rounded-2xl p-8 bg-black/20 backdrop-blur-sm">
                  <div className="space-y-6 text-gray-200">
                    <div>
                      <h3 className="text-xl text-[var(--botanical-green)] font-semibold mb-3">🔍 What is EcoLens?</h3>
                      <p className="text-lg leading-relaxed mb-4">
                        EcoLens is a real-time funding tracker for climate tech startups. We use AI to surface, structure, and tag public funding data—helping you see who's investing in climate innovation, and where capital is (or isn't) flowing.
                      </p>
                      <p className="text-lg leading-relaxed">
                        Think of EcoLens as an accessible, lightweight alternative to PitchBook or CB Insights—focused exclusively on climate tech.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why EcoLens Exists */}
            <div className="mb-16">
              <div className="border border-[var(--botanical-green)] rounded-2xl p-8 bg-black/20 backdrop-blur-sm">
                <h3 className="text-2xl text-white font-semibold mb-6 flex items-center">
                  💡 Why EcoLens Exists
                </h3>
                <div className="space-y-4 text-gray-200 text-lg leading-relaxed">
                  <p>
                    Climate tech is booming—but funding data is often locked behind paywalls, outdated, or hard to search. We believe climate progress depends on better visibility: Who's funding what, where, and why?
                  </p>
                  <p className="mb-4">EcoLens exists to:</p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-[var(--botanical-green)] mr-3 mt-1">•</span>
                      <span>Empower founders with insight into who's investing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--botanical-green)] mr-3 mt-1">•</span>
                      <span>Help investors spot trends and gaps</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--botanical-green)] mr-3 mt-1">•</span>
                      <span>Support researchers, journalists, and policymakers in tracking the pulse of climate innovation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Who It's For */}
              <div className="border border-[var(--botanical-green)] rounded-xl p-6 bg-black/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--botanical-green)]/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-xl text-white font-semibold">Who It's For</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-[var(--botanical-green)] mr-3 mt-1">🌱</span>
                    <span><strong>Climate founders</strong> mapping investor networks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--botanical-green)] mr-3 mt-1">💸</span>
                    <span><strong>Investors & VCs</strong> tracking early signals and trends</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--botanical-green)] mr-3 mt-1">📊</span>
                    <span><strong>Policy orgs & analysts</strong> monitoring capital flows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--botanical-green)] mr-3 mt-1">📰</span>
                    <span><strong>Writers & researchers</strong> telling the climate funding story</span>
                  </li>
                </ul>
              </div>

              {/* How It Works */}
              <div className="border border-[var(--botanical-green)] rounded-xl p-6 bg-black/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--botanical-green)]/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-xl text-white font-semibold">How It Works</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p className="mb-3">We scrape public data (e.g. press releases, news articles)</p>
                  <p className="mb-2">Use AI + NLP to extract structured info like:</p>
                  <ul className="space-y-2 text-sm ml-4">
                    <li className="flex items-start">
                      <span className="text-[var(--botanical-green)] mr-2 mt-1">•</span>
                      <span>Company name, funding stage, date, amount</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--botanical-green)] mr-2 mt-1">•</span>
                      <span>Sector, investor, location</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--botanical-green)] mr-2 mt-1">•</span>
                      <span>Climate impact metrics + problem solved</span>
                    </li>
                  </ul>
                  <p className="text-sm mt-3">You can filter and search by sector, investor, country, date, tags, and more</p>
                </div>
              </div>

              {/* Built By */}
              <div className="border border-[var(--botanical-green)] rounded-xl p-6 bg-black/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[var(--botanical-green)]/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🧑‍💻</span>
                  </div>
                  <h3 className="text-xl text-white font-semibold">Built By</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <p>
                    EcoLens is created by a small team of builders passionate about climate tech, data transparency, and real-world impact.
                  </p>
                  <p>
                    This project was built during a climate AI sprint to explore how open data and AI can make a difference.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="border border-[var(--botanical-green)] rounded-2xl p-8 bg-black/20 backdrop-blur-sm inline-block">
                <h3 className="text-2xl text-white font-semibold mb-4">🤝 Get Involved</h3>
                <div className="text-gray-300 text-lg max-w-2xl">
                  <p className="mb-4">
                    Interested in contributing, improving the dataset, or using EcoLens for research? We'd love to hear from you.
                  </p>
                  <p>
                    📬 [Contact us] or check the [Documentation] for more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 