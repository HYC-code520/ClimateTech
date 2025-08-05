import { SidebarLayout } from "@/components/ui/sidebar-layout";
import FundingTrackerPage from "./funding-tracker";

export default function FundingTrackerWithSidebar() {
  return (
    <SidebarLayout>
      <FundingTrackerPage />
    </SidebarLayout>
  );
} 