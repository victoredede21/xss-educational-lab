import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import HookedBrowsers from "@/pages/HookedBrowsers";
import Commands from "@/pages/Commands";
import Logs from "@/pages/Logs";
import Tutorials from "@/pages/Tutorials";
import Prevention from "@/pages/Prevention";
import Resources from "@/pages/Resources";
import Settings from "@/pages/Settings";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { SidebarProvider } from "./lib/context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/hooked-browsers" component={HookedBrowsers} />
      <Route path="/commands" component={Commands} />
      <Route path="/logs" component={Logs} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/prevention" component={Prevention} />
      <Route path="/resources" component={Resources} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
