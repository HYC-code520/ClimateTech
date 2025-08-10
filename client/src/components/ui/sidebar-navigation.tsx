import {
  TrendingUp,
  Users,
  Rocket,
  MapPin,
  Settings,
  HelpCircle
} from "lucide-react";
import { useLocation } from "wouter";

interface SidebarNavigationProps {
  className?: string;
}

export function SidebarNavigation({ className = "" }: SidebarNavigationProps) {
  const [location, setLocation] = useLocation();

  const navigationItems = [
    {
      icon: Users,
      label: "Investors",
      path: "/investors",
      active: location === "/investors"
    },
    {
      icon: Rocket,
      label: "Startups",
      path: "/startups",
      active: location === "/startups"
    },
    {
      icon: MapPin,
      label: "Map View",
      path: "/map",
      active: location === "/map"
    },
    {
      icon: TrendingUp,
      label: "Funder Tracker",
      path: "/funding-tracker",
      active: location === "/funding-tracker"
    }
  ];

  const bottomItems = [
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      active: location === "/settings"
    },
    {
      icon: HelpCircle,
      label: "Help",
      path: "/help",
      active: location === "/help"
    }
  ];

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  return (
    <div className={`w-64 bg-gray-800 h-full flex flex-col ${className}`}>
      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-[var(--botanical-green)] text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Items */}
      <div className="px-4 py-4 border-t border-gray-700">
        <nav className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active
                    ? 'bg-[var(--botanical-green)] text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}