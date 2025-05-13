import StatCard from "@/components/dashboard/StatCard";
import HookedBrowsersTable from "@/components/dashboard/HookedBrowsersTable";
import CommandModuleCard from "@/components/dashboard/CommandModuleCard";
import ResourceCard from "@/components/dashboard/ResourceCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useHookedBrowsers, useCommands, useCommandExecutions, useHookStatistics } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [serverUptime, setServerUptime] = useState("0d 0h 0m");
  const browsersQuery = useHookedBrowsers();
  const commandsQuery = useCommands();
  const executionsQuery = useCommandExecutions();
  const hookStatsQuery = useHookStatistics();
  
  // Calculate mock uptime for demo purposes
  useEffect(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    startDate.setHours(startDate.getHours() - 4);
    startDate.setMinutes(startDate.getMinutes() - 17);
    
    const updateUptime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setServerUptime(`${days}d ${hours}h ${minutes}m`);
    };
    
    updateUptime();
    const interval = setInterval(updateUptime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get active browsers count
  const getActiveBrowsersCount = () => {
    if (hookStatsQuery.data) {
      return hookStatsQuery.data.active;
    }
    
    if (browsersQuery.data) {
      return browsersQuery.data.filter(b => b.isOnline).length;
    }
    
    return 0;
  };
  
  // Get commands executed count
  const getCommandsExecutedCount = () => {
    if (executionsQuery.data) {
      return executionsQuery.data.length;
    }
    
    return 0;
  };
  
  // Get attack vectors (command categories) count
  const getAttackVectorsCount = () => {
    if (commandsQuery.data) {
      const categories = new Set(commandsQuery.data.map(cmd => cmd.category));
      return categories.size;
    }
    
    return 0;
  };
  
  // Get new hooks in the last hour
  const getNewHooksLastHour = () => {
    if (browsersQuery.data) {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const newHooks = browsersQuery.data.filter(browser => {
        const firstSeen = new Date(browser.firstSeen);
        return firstSeen > oneHourAgo;
      });
      
      return newHooks.length;
    }
    
    return 0;
  };
  
  return (
    <div className="p-6">
      {/* Educational Disclaimer */}
      <Alert className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <AlertTitle className="text-sm font-medium text-yellow-800">Educational Tool Disclaimer</AlertTitle>
            <AlertDescription className="mt-2 text-sm text-yellow-700">
              <p>This XSS Educational Lab is designed for <strong>educational purposes only</strong>. Using these techniques against systems without explicit permission is illegal and unethical. Always practice responsible security research.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Active Hooks" 
          value={getActiveBrowsersCount()}
          icon="link"
          iconBgColor="bg-primary-light bg-opacity-10"
          iconColor="text-primary"
          footer={
            <div className="text-xs font-medium text-green-500 flex items-center">
              <span className="material-icons text-sm mr-1">arrow_upward</span>
              <span>{getNewHooksLastHour()} new in the last hour</span>
            </div>
          }
        />
        
        <StatCard 
          title="Commands Executed" 
          value={getCommandsExecutedCount()}
          icon="code"
          iconBgColor="bg-secondary-light bg-opacity-10"
          iconColor="text-secondary"
          footer={
            <div className="text-xs font-medium text-neutral-500 flex items-center">
              <span>Today's total</span>
            </div>
          }
        />
        
        <StatCard 
          title="Attack Vectors" 
          value={getAttackVectorsCount()}
          icon="security"
          iconBgColor="bg-accent-light bg-opacity-10"
          iconColor="text-accent"
          footer={
            <div className="text-xs font-medium text-neutral-500 flex items-center">
              <span>Available for testing</span>
            </div>
          }
        />
        
        <StatCard 
          title="Server Status" 
          value="Online"
          icon="cloud_done"
          iconBgColor="bg-success bg-opacity-10"
          iconColor="text-success"
          footer={
            <div className="text-xs font-medium text-neutral-500 flex items-center">
              <span>Uptime: {serverUptime}</span>
            </div>
          }
        />
      </div>

      {/* Active Hooks Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Active Hooks</h2>
          <Link href="/hooked-browsers">
            <Button variant="link" className="text-primary hover:text-primary-dark flex items-center p-0 h-auto">
              <span>View All</span>
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </Button>
          </Link>
        </div>
        
        <HookedBrowsersTable 
          browsers={browsersQuery.data || []} 
          isLoading={browsersQuery.isLoading} 
          limit={3}
        />
      </div>

      {/* Available Commands Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Command Modules</h2>
          <div className="flex items-center space-x-2">
            <Link href="/commands">
              <Button variant="link" className="text-primary hover:text-primary-dark flex items-center p-0 h-auto">
                <span>View All</span>
                <span className="material-icons text-sm ml-1">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {commandsQuery.isLoading ? (
            <p className="text-neutral-600 dark:text-neutral-300">Loading command modules...</p>
          ) : commandsQuery.data && commandsQuery.data.length > 0 ? (
            commandsQuery.data.slice(0, 6).map(module => (
              <CommandModuleCard key={module.id} module={module} />
            ))
          ) : (
            <p className="text-neutral-600 dark:text-neutral-300">No command modules found.</p>
          )}
        </div>
      </div>

      {/* Educational Resources */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Educational Resources</h2>
          <Link href="/resources">
            <Button variant="link" className="text-primary hover:text-primary-dark flex items-center p-0 h-auto">
              <span>View All</span>
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard
            title="XSS Prevention"
            description="Learn how to properly secure web applications against XSS vulnerabilities."
            links={[
              { title: "OWASP XSS Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" },
              { title: "Content Security Policy (CSP) Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" },
              { title: "Input Validation Best Practices", url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html" }
            ]}
            linkUrl="/prevention"
          />
          
          <ResourceCard
            title="Ethical Security Testing"
            description="Resources on responsible security research and ethical considerations."
            links={[
              { title: "Responsible Disclosure Guidelines", url: "https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html" },
              { title: "Legal Aspects of Security Research", url: "https://www.cisa.gov/coordinated-vulnerability-disclosure-process" },
              { title: "Bug Bounty Best Practices", url: "https://www.hackerone.com/vulnerability-management/what-bug-bounty-program-and-how-does-it-work" }
            ]}
            linkUrl="/resources"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
