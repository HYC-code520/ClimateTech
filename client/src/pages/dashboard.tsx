import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";

export default function DashboardPage() {
  return (
    <NavbarSidebarLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-[80vh] w-full px-8">
        <div className="flex flex-col items-center space-y-8 max-w-3xl w-full">
          
          {/* Large GIF - Notice the path starts with / and no "public" */}
          <div className="w-full max-w-2xl flex justify-center">
            <img 
              src="/comingsoon.gif" 
              alt="Dashboard launching soon" 
              className="max-w-full max-h-96 object-contain rounded-lg"
            />
          </div>
          
          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-wide">Dashboard</h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Coming soon with comprehensive analytics and insights
            </p>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
} 