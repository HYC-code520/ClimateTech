import { 
  TrendingUp, 
  LayoutDashboard, 
  Users, 
  Rocket, 
  Building2, 
  MapPin, 
  Database, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import { useLocation } from "wouter";

interface SidebarNavigationProps {
  className?: string;
}

export function SidebarNavigation({ className = "" }: SidebarNavigationProps) {
  const [, setLocation] = useLocation();

  const navigationItems = [
    {
      icon: TrendingUp,
      label: "Funding Events",
      path: "/funding-tracker",
      active: true
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      active: false
    },
    {
      icon: Users,
      label: "Investors",
      path: "/investors",
      active: false
    },
    {
      icon: Rocket,
      label: "Startups",
      path: "/startups",
      active: false
    },
    {
      icon: Building2,
      label: "Sectors",
      path: "/sectors",
      active: false
    },
    {
      icon: MapPin,
      label: "Map View",
      path: "/map",
      active: false
    },
    {
      icon: Database,
      label: "Source Data",
      path: "/source-data",
      active: false
    }
  ];

  const bottomItems = [
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      active: false
    },
    {
      icon: HelpCircle,
      label: "Help",
      path: "/help",
      active: false
    }
  ];

  const handleNavigation = (path: string) => {
    if (path === "/funding-tracker") {
      // Stay on current page if it's funding tracker
      return;
    }
    // For other paths, you can implement navigation or show coming soon
    console.log(`Navigate to ${path}`);
    // setLocation(path); // Uncomment when pages are ready
  };

  return (
    <div className={`w-64 bg-gray-800 h-screen flex flex-col ${className}`}>
      {/* Main Navigation */}
      <div className="flex-1 pt-6">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                  item.active
                    ? "bg-[var(--botanical-green)]/20 text-[var(--botanical-green)] border-l-2 border-[var(--botanical-green)]"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="pb-6">
        <nav className="space-y-1 px-3">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 