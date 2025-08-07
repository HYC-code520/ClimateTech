import { NavbarSidebarLayout } from "@/components/ui/navbar-sidebar-layout";
import FundingTrackerContent from "./funding-tracker-content";
import { Search, ChevronDown, Calendar, Filter, ExternalLink, MapPin, DollarSign, Building2, ChevronRight } from "lucide-react";

export default function FundingTrackerWithSidebar() {
  return (
    <NavbarSidebarLayout>
      <FundingTrackerContent />
    </NavbarSidebarLayout>
  );
} 