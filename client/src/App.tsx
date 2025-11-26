import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Owners from "@/pages/Owners";
import Buildings from "@/pages/Buildings";
import Units from "@/pages/Units";
import Tenants from "@/pages/Tenants";
import Workflows from "@/pages/Workflows";
import Team from "@/pages/Team";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/owners" component={Owners} />
      <Route path="/buildings" component={Buildings} />
      <Route path="/units" component={Units} />
      <Route path="/tenants" component={Tenants} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/team" component={Team} />
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
