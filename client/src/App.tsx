import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Owners from "@/pages/Owners";
import Buildings from "@/pages/Properties";
import Units from "@/pages/Units";
import Tenants from "@/pages/Tenants";
import Workflows from "@/pages/Workflows";
import Team from "@/pages/Team";
import TeamMemberDetail from "@/pages/TeamMemberDetail";
import PropertyDetail from "@/pages/PropertyDetail";
import UnitDetail from "@/pages/UnitDetail";
import AlertsPrescriptions from "@/pages/AlertsPrescriptions";
import Insights from "@/pages/Insights";
import Reports from "@/pages/Reports";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";
import Automations from "@/pages/Automations";

import OwnerDetail from "@/pages/OwnerDetail";

import TenantDetail from "@/pages/TenantDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/owners" component={Owners} />
      <Route path="/owners/:id" component={OwnerDetail} />
      <Route path="/properties" component={Buildings} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/units" component={Units} />
      <Route path="/units/:id" component={UnitDetail} />
      <Route path="/tenants" component={Tenants} />
      <Route path="/tenants/:id" component={TenantDetail} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/team" component={Team} />
      <Route path="/team/:id" component={TeamMemberDetail} />
      <Route path="/alerts" component={AlertsPrescriptions} />
      <Route path="/insights" component={Insights} />
      <Route path="/reports" component={Reports} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/automations" component={Automations} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
