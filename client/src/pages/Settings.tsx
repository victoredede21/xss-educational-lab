import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTheme } from "@/lib/context";
import HookJsModal from "@/components/hooks/HookJsModal";

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [showHookModal, setShowHookModal] = useState(false);
  
  // UI Settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("10");
  const [showNotifications, setShowNotifications] = useState(true);
  const [logLevel, setLogLevel] = useState("info");
  
  // Hook Settings
  const [hookUrl, setHookUrl] = useState("/hook.js");
  const [hookInternal, setHookInterval] = useState("5000");
  const [showEducationalBanner, setShowEducationalBanner] = useState(true);
  
  // Command Settings
  const [commandExecutionTimeout, setCommandExecutionTimeout] = useState("30");
  const [sandboxCommands, setSandboxCommands] = useState(true);
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to server or local storage
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated.",
    });
  };
  
  // Handle reset settings
  const handleResetSettings = () => {
    // Reset to defaults
    setAutoRefresh(true);
    setRefreshInterval("10");
    setShowNotifications(true);
    setLogLevel("info");
    setHookUrl("/hook.js");
    setHookInterval("5000");
    setShowEducationalBanner(true);
    setCommandExecutionTimeout("30");
    setSandboxCommands(true);
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
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
            <AlertTitle className="text-sm font-medium text-yellow-800">Educational Tool Settings</AlertTitle>
            <AlertDescription className="mt-2 text-sm text-yellow-700">
              <p>These settings control how the XSS Educational Lab operates. All functionality is intended for educational and authorized testing purposes only.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      <h1 className="text-2xl font-bold mb-6">Lab Configuration</h1>
      
      <Tabs defaultValue="interface">
        <TabsList className="mb-6">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="hooks">Hook Settings</TabsTrigger>
          <TabsTrigger value="commands">Command Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* Interface Settings Tab */}
        <TabsContent value="interface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Configure how the interface looks and behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch
                    id="darkMode"
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRefresh">Auto-refresh Data</Label>
                  <Switch
                    id="autoRefresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                </div>
                
                {autoRefresh && (
                  <div className="space-y-2">
                    <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      min="5"
                      max="60"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Show Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={showNotifications}
                    onCheckedChange={setShowNotifications}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Logging</CardTitle>
                <CardDescription>Configure logging behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select log level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => toast({
                    title: "Logs cleared",
                    description: "All logs have been cleared from the system."
                  })}>
                    Clear All Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Hook Settings Tab */}
        <TabsContent value="hooks">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>JavaScript Hook Configuration</CardTitle>
                <CardDescription>Settings for the JavaScript hook functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hookUrl">Hook URL Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hookUrl"
                      value={hookUrl}
                      onChange={(e) => setHookUrl(e.target.value)}
                      placeholder="/hook.js"
                    />
                    <Button onClick={() => setShowHookModal(true)}>
                      View Hook Code
                    </Button>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    The URL path where the hook JavaScript file is served
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hookInterval">Hook Poll Interval (ms)</Label>
                  <Input
                    id="hookInterval"
                    type="number"
                    value={hookInternal}
                    onChange={(e) => setHookInterval(e.target.value)}
                    min="1000"
                    max="60000"
                  />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    How often the hooked browser checks for new commands (milliseconds)
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="educationalBanner">Show Educational Banner</Label>
                  <Switch
                    id="educationalBanner"
                    checked={showEducationalBanner}
                    onCheckedChange={setShowEducationalBanner}
                  />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Display an educational disclaimer on hooked pages
                </p>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded mt-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Note:</strong> Changes to hook settings will only affect newly connected browsers. 
                    Existing hooks will continue to use their original configuration until reconnected.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hook Management</CardTitle>
                <CardDescription>Manage browser connections and hooks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoDisconnect">Auto-disconnect inactive hooks</Label>
                  <Switch
                    id="autoDisconnect"
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Automatically disconnect browsers that haven't reported in for more than 10 minutes
                </p>
                
                <div className="space-y-2 pt-2">
                  <Label>Hook Management Actions</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => toast({
                      title: "Operation not available",
                      description: "This would disconnect all hooks in a real environment",
                      variant: "default",
                    })}>
                      Disconnect All Hooks
                    </Button>
                    <Button variant="destructive" onClick={() => toast({
                      title: "Operation not available",
                      description: "This would purge all inactive hooks in a real environment",
                      variant: "default",
                    })}>
                      Purge Inactive Hooks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Command Settings Tab */}
        <TabsContent value="commands">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Command Execution</CardTitle>
                <CardDescription>Configure how commands are executed on hooked browsers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="executionTimeout">Command Execution Timeout (seconds)</Label>
                  <Input
                    id="executionTimeout"
                    type="number"
                    value={commandExecutionTimeout}
                    onChange={(e) => setCommandExecutionTimeout(e.target.value)}
                    min="5"
                    max="120"
                  />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Maximum time allowed for a command to execute before timeout
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="sandboxCommands">Sandbox Command Execution</Label>
                  <Switch
                    id="sandboxCommands"
                    checked={sandboxCommands}
                    onCheckedChange={setSandboxCommands}
                  />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Execute commands in a sandboxed environment for additional safety
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom Command Module</CardTitle>
                <CardDescription>Create a new command module</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commandName">Module Name</Label>
                  <Input id="commandName" placeholder="Get Browser Cookies" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commandCategory">Category</Label>
                  <Select defaultValue="Information Gathering">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Information Gathering">Information Gathering</SelectItem>
                      <SelectItem value="DOM Manipulation">DOM Manipulation</SelectItem>
                      <SelectItem value="Network Detection">Network Detection</SelectItem>
                      <SelectItem value="Form Manipulation">Form Manipulation</SelectItem>
                      <SelectItem value="Social Engineering">Social Engineering</SelectItem>
                      <SelectItem value="Persistence Techniques">Persistence Techniques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commandDescription">Description</Label>
                  <Input id="commandDescription" placeholder="Retrieves cookies from the browser" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commandCode">JavaScript Code</Label>
                  <Textarea
                    id="commandCode"
                    rows={6}
                    placeholder={`(() => {
  // Educational demonstration only
  return {
    cookies: document.cookie
  };
})();`}
                  />
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button onClick={() => toast({
                    title: "Feature not available",
                    description: "Custom command module creation would be saved in a real environment",
                    variant: "default",
                  })}>
                    Save Command Module
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Advanced Settings Tab */}
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxSessions">Maximum Concurrent Sessions</Label>
                  <Input
                    id="maxSessions"
                    type="number"
                    defaultValue="25"
                    min="5"
                    max="100"
                  />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Maximum number of hooked browsers that can be connected simultaneously
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    defaultValue="7"
                    min="1"
                    max="30"
                  />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    How long logs and browser data are kept before automatic deletion
                  </p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded mt-4">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>Warning:</strong> Changes to these settings may affect system performance and stability.
                    Only modify if you understand the implications.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Backup & Reset</CardTitle>
                <CardDescription>Backup your settings or reset the lab</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => toast({
                      title: "Settings exported",
                      description: "Your settings have been exported to settings.json",
                      variant: "default",
                    })}>
                      Export Settings
                    </Button>
                    <Button variant="outline" onClick={() => toast({
                      title: "Feature not available",
                      description: "Settings import would be available in a real environment",
                      variant: "default",
                    })}>
                      Import Settings
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="destructive" onClick={() => toast({
                      title: "Reset not available",
                      description: "Factory reset would be available in a real environment",
                      variant: "destructive",
                    })}>
                      Factory Reset
                    </Button>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                      This will reset all settings, delete all hooked browser data, and restore the lab to its default state.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handleResetSettings}>
          Reset Settings
        </Button>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
      
      {showHookModal && <HookJsModal onClose={() => setShowHookModal(false)} />}
    </div>
  );
};

export default Settings;
