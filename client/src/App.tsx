import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import HomePage from "@/pages/home";
import FundingTrackerWithSidebar from "@/pages/funding-tracker-with-sidebar";
import InsightsPage from "@/pages/insights";
import AboutPage from "@/pages/about";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";
import InvestorsPage from "@/pages/investors";
import DashboardPage from "@/pages/dashboard";
import StartupsPage from "@/pages/startups";
import SectorsPage from "@/pages/sectors";
import MapPage from "@/pages/map";
import SourceDataPage from "@/pages/source-data";
import SettingsPage from "@/pages/settings";
import HelpPage from "@/pages/help";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/funding-tracker" component={FundingTrackerWithSidebar} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/investors" component={InvestorsPage} />
      <Route path="/startups" component={StartupsPage} />
      <Route path="/sectors" component={SectorsPage} />
      <Route path="/map" component={MapPage} />
      <Route path="/source-data" component={SourceDataPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/help" component={HelpPage} />
      <Route path="/insights" component={InsightsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/login" component={AuthPage} />
      <Route path="/signup" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
