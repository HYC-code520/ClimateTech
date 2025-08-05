import { SidebarNavigation } from "./sidebar-navigation";

interface SidebarLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function SidebarLayout({ children, showSidebar = true }: SidebarLayoutProps) {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <SidebarNavigation className="flex-shrink-0" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 