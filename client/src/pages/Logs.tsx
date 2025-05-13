import { useLogs, useHookedBrowsers } from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Log } from "@shared/schema";

const getLevelClass = (level: string) => {
  switch (level.toLowerCase()) {
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
  }
};

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedBrowserId, setSelectedBrowserId] = useState<string>("");
  
  // Queries
  const logsQuery = useLogs();
  const browsersQuery = useHookedBrowsers();
  
  // Filter logs
  const getFilteredLogs = (): Log[] => {
    if (!logsQuery.data) return [];
    
    let filteredLogs = logsQuery.data;
    
    if (selectedBrowserId) {
      filteredLogs = filteredLogs.filter(log => log.browserId === parseInt(selectedBrowserId));
    }
    
    if (selectedLevel) {
      filteredLogs = filteredLogs.filter(log => log.level.toLowerCase() === selectedLevel.toLowerCase());
    }
    
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log => 
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
        JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by timestamp (newest first)
    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  
  // Get browser name by ID
  const getBrowserName = (browserId?: number) => {
    if (!browserId || !browsersQuery.data) return 'System';
    
    const browser = browsersQuery.data.find(b => b.id === browserId);
    return browser ? `${browser.browser} (${browser.ipAddress})` : `Browser #${browserId}`;
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
              <p>This logs page shows system events and command executions for educational purposes. In a real attack scenario, this would track attacker activities and victim interactions.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      {/* Log Controls */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">search</span>
            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedBrowserId} onValueChange={setSelectedBrowserId}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Browsers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Browsers</SelectItem>
                {browsersQuery.data?.map((browser) => (
                  <SelectItem key={browser.id} value={browser.id.toString()}>
                    {browser.browser} ({browser.ipAddress})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => logsQuery.refetch()}>
              <span className="material-icons mr-2">refresh</span>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Browser</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {logsQuery.isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-300">
                      Loading logs...
                    </td>
                  </tr>
                ) : getFilteredLogs().length > 0 ? (
                  getFilteredLogs().map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {getBrowserName(log.browserId)}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {log.event.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className={getLevelClass(log.level)}>
                          {log.level}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300">
                        {log.details ? (
                          <pre className="text-xs overflow-auto max-w-md">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        ) : (
                          <span className="text-neutral-400">No details</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-300">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
