import { useHookedBrowsers } from "@/lib/hooks";
import HookedBrowsersTable from "@/components/dashboard/HookedBrowsersTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HookedBrowser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import HookJsModal from "@/components/hooks/HookJsModal";

const HookedBrowsers = () => {
  const [showHookModal, setShowHookModal] = useState(false);
  const queryClient = useQueryClient();
  const browsersQuery = useHookedBrowsers();
  
  // Filter browsers by status
  const getActiveBrowsers = () => {
    if (!browsersQuery.data) return [];
    return browsersQuery.data.filter(browser => browser.isOnline);
  };
  
  const getIdleBrowsers = () => {
    if (!browsersQuery.data) return [];
    
    return browsersQuery.data.filter(browser => {
      if (browser.isOnline) return false;
      
      const lastSeen = new Date(browser.lastSeen);
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
      return lastSeen > fiveMinutesAgo;
    });
  };
  
  const getOfflineBrowsers = () => {
    if (!browsersQuery.data) return [];
    
    return browsersQuery.data.filter(browser => {
      if (browser.isOnline) return false;
      
      const lastSeen = new Date(browser.lastSeen);
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
      return lastSeen <= fiveMinutesAgo;
    });
  };
  
  // Refresh browsers list
  const refreshBrowsers = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/browsers'] });
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
              <p>This page displays browsers that have been "hooked" using the educational XSS hook. In a real-world scenario, attackers would use this to track and control compromised browsers.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      {/* Actions Card */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Hooked Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setShowHookModal(true)}>
                <span className="material-icons mr-2">code</span>
                Get Hook Code
              </Button>
              <Button variant="outline" onClick={refreshBrowsers}>
                <span className="material-icons mr-2">refresh</span>
                Refresh Browsers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Browser Tabs */}
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Browsers ({browsersQuery.data?.length || 0})</TabsTrigger>
            <TabsTrigger value="active">Active ({getActiveBrowsers().length})</TabsTrigger>
            <TabsTrigger value="idle">Idle ({getIdleBrowsers().length})</TabsTrigger>
            <TabsTrigger value="offline">Offline ({getOfflineBrowsers().length})</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all">
          <HookedBrowsersTable 
            browsers={browsersQuery.data || []} 
            isLoading={browsersQuery.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="active">
          <HookedBrowsersTable 
            browsers={getActiveBrowsers()} 
            isLoading={browsersQuery.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="idle">
          <HookedBrowsersTable 
            browsers={getIdleBrowsers()} 
            isLoading={browsersQuery.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="offline">
          <HookedBrowsersTable 
            browsers={getOfflineBrowsers()} 
            isLoading={browsersQuery.isLoading} 
          />
        </TabsContent>
      </Tabs>
      
      {showHookModal && <HookJsModal onClose={() => setShowHookModal(false)} />}
    </div>
  );
};

export default HookedBrowsers;
