import { useCommands, useCommandCategories, useCommandsByCategory, useHookedBrowsers } from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import CommandModuleCard from "@/components/dashboard/CommandModuleCard";
import { CommandModule } from "@shared/schema";
import { AlertCircle } from "lucide-react";

const Commands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrowserId, setSelectedBrowserId] = useState<number | undefined>(undefined);
  const [location, search] = useLocation();
  
  // Parse browser ID from query string
  useEffect(() => {
    const params = new URLSearchParams(search);
    const browserId = params.get("browserId");
    if (browserId) {
      setSelectedBrowserId(parseInt(browserId));
    }
  }, [search]);
  
  // Queries
  const commandsQuery = useCommands();
  const categoriesQuery = useCommandCategories();
  const categoryCommandsQuery = useCommandsByCategory(selectedCategory);
  const browsersQuery = useHookedBrowsers();
  
  // Filter commands
  const getFilteredCommands = (): CommandModule[] => {
    let commands: CommandModule[] = [];
    
    if (selectedCategory && categoryCommandsQuery.data) {
      commands = categoryCommandsQuery.data;
    } else if (commandsQuery.data) {
      commands = commandsQuery.data;
    }
    
    if (searchTerm) {
      return commands.filter(command => 
        command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        command.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return commands;
  };
  
  // Group commands by category
  const getCommandsByCategory = () => {
    const commands = getFilteredCommands();
    const groupedCommands: { [key: string]: CommandModule[] } = {};
    
    commands.forEach(command => {
      if (!groupedCommands[command.category]) {
        groupedCommands[command.category] = [];
      }
      groupedCommands[command.category].push(command);
    });
    
    return groupedCommands;
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
              <p>These command modules are for educational purposes only. They demonstrate various XSS techniques and browser manipulation methods. Using these against systems without permission is illegal and unethical.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      {/* Command Controls */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Command Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Search commands..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">search</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categoriesQuery.data?.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedBrowserId?.toString() || ""}
              onValueChange={(value) => setSelectedBrowserId(value ? parseInt(value) : undefined)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select Browser</SelectItem>
                {browsersQuery.data?.filter(browser => browser.isOnline).map((browser) => (
                  <SelectItem key={browser.id} value={browser.id.toString()}>
                    {browser.browser} ({browser.ipAddress})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!selectedBrowserId && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm text-blue-800 dark:text-blue-200">
              <p>Select a browser to execute commands. Commands will be sent to the selected browser.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Command Modules */}
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="category">Category View</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Grid View */}
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {commandsQuery.isLoading ? (
              <p>Loading command modules...</p>
            ) : getFilteredCommands().length > 0 ? (
              getFilteredCommands().map((command) => (
                <CommandModuleCard 
                  key={command.id} 
                  module={command} 
                  browserId={selectedBrowserId}
                />
              ))
            ) : (
              <p>No command modules found.</p>
            )}
          </div>
        </TabsContent>
        
        {/* Category View */}
        <TabsContent value="category">
          {commandsQuery.isLoading ? (
            <p>Loading command modules...</p>
          ) : Object.entries(getCommandsByCategory()).length > 0 ? (
            Object.entries(getCommandsByCategory()).map(([category, commands]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="material-icons mr-2 text-neutral-500">{commands[0]?.icon || 'folder'}</span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {commands.map((command) => (
                    <CommandModuleCard 
                      key={command.id} 
                      module={command} 
                      browserId={selectedBrowserId}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No command modules found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commands;
