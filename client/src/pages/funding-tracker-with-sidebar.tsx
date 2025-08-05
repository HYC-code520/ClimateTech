import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import FundingTrackerContent from "./funding-tracker-content";

export default function FundingTrackerWithSidebar() {
  return (
    <NavbarSidebarLayout>
      <FundingTrackerContent />
    </NavbarSidebarLayout>
  );
} 