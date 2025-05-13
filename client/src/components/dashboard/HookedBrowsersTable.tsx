import { Button } from "@/components/ui/button";
import { HookedBrowser } from "@shared/schema";
import { formatDate, getBrowserIcon, getStatusClass } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "wouter";

interface HookedBrowsersTableProps {
  browsers: HookedBrowser[];
  isLoading: boolean;
  limit?: number;
}

const HookedBrowsersTable = ({ browsers, isLoading, limit }: HookedBrowsersTableProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useNavigate();
  const [expandedBrowserId, setExpandedBrowserId] = useState<number | null>(null);
  
  const limitedBrowsers = limit ? browsers.slice(0, limit) : browsers;
  
  // Execute command mutation
  const executeCommandMutation = useMutation({
    mutationFn: async ({ browserId, moduleId }: { browserId: number, moduleId: number }) => {
      const response = await apiRequest('POST', '/api/execute', { browserId, moduleId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executions'] });
      toast({
        title: "Command sent",
        description: "The command has been sent to the browser",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending command",
        description: error.message || "Failed to send command",
        variant: "destructive",
      });
    }
  });
  
  // Delete browser mutation
  const deleteBrowserMutation = useMutation({
    mutationFn: async (browserId: number) => {
      const response = await apiRequest('DELETE', `/api/browsers/${browserId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/browsers'] });
      toast({
        title: "Browser deleted",
        description: "The browser has been removed from the list",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting browser",
        description: error.message || "Failed to delete browser",
        variant: "destructive",
      });
    }
  });
  
  // Handle command button click
  const handleCommandClick = (browserId: number) => {
    navigate(`/commands?browserId=${browserId}`);
  };
  
  // Handle view details button click
  const handleDetailsClick = (browserId: number) => {
    if (expandedBrowserId === browserId) {
      setExpandedBrowserId(null);
    } else {
      setExpandedBrowserId(browserId);
    }
  };
  
  // Get browser status
  const getBrowserStatus = (browser: HookedBrowser) => {
    if (browser.isOnline) return "Active";
    
    // Check if lastSeen is within 5 minutes
    const lastSeen = new Date(browser.lastSeen);
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    return lastSeen > fiveMinutesAgo ? "Idle" : "Offline";
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 text-center">
        <p className="text-neutral-600 dark:text-neutral-300">Loading browsers...</p>
      </div>
    );
  }
  
  if (!browsers || browsers.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6 text-center">
        <p className="text-neutral-600 dark:text-neutral-300">No hooked browsers found.</p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">Use the hook code to connect browsers to your lab.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Browser
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                OS
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {limitedBrowsers.map((browser) => (
              <>
                <tr key={browser.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    #{browser.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center">
                      <span className="material-icons text-neutral-400 mr-2">{getBrowserIcon(browser.browser || '')}</span>
                      {browser.browser} {browser.browserVersion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                    {browser.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                    {browser.os}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(getBrowserStatus(browser))}`}>
                      {getBrowserStatus(browser)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-primary hover:text-primary-dark mr-3"
                      onClick={() => handleCommandClick(browser.id)}
                    >
                      Command
                    </button>
                    <button 
                      className="text-secondary hover:text-secondary-dark"
                      onClick={() => handleDetailsClick(browser.id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
                {expandedBrowserId === browser.id && (
                  <tr key={`${browser.id}-details`}>
                    <td colSpan={6} className="px-6 py-4 bg-neutral-50 dark:bg-neutral-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Page URL:</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 break-all">{browser.pageUrl}</p>
                          
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-2">User Agent:</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 break-all">{browser.userAgent}</p>
                          
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-2">Referer:</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 break-all">{browser.referer || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">First Seen:</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">{formatDate(browser.firstSeen)}</p>
                          
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-2">Last Seen:</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">{formatDate(browser.lastSeen)}</p>
                          
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mt-2">Session ID:</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 font-mono">{browser.sessionId}</p>
                          
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteBrowserMutation.mutate(browser.id)}
                              disabled={deleteBrowserMutation.isPending}
                            >
                              Delete Browser
                            </Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HookedBrowsersTable;
