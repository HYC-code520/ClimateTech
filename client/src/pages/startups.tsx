import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";

export default function StartupsPage() {
  return (
    <NavbarSidebarLayout>
      <div className="w-full px-8 md:px-12 py-8">
        {/* Title + Subtitle (left aligned like Funding Tracker) */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white mb-2">Startups</h1>
          <p className="text-gray-400">
            Discover and track climate tech startups
          </p>
        </div>

        {/* Centered, larger GIF */}
        <div className="mt-8 min-h-[60vh] flex items-center justify-center">
          <img
            src="/comingsoon.gif"
            alt="Startups page launching soon"
            className="w-full h-auto max-w-[900px] md:max-w-[500px] object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
} 