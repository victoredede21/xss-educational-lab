import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandModule } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CommandModuleCardProps {
  module: CommandModule;
  browserId?: number;
}

const CommandModuleCard = ({ module, browserId }: CommandModuleCardProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Execute command mutation
  const executeCommandMutation = useMutation({
    mutationFn: async () => {
      if (!browserId) {
        throw new Error("No browser selected to execute command");
      }
      
      const response = await apiRequest('POST', '/api/execute', {
        browserId,
        moduleId: module.id
      });
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/executions'] });
      
      toast({
        title: "Command sent",
        description: `${module.name} command has been sent to the browser`,
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

  return (
    <Card className="bg-white dark:bg-neutral-800 rounded-lg shadow h-full flex flex-col">
      <CardHeader className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <CardTitle className="font-medium text-neutral-800 dark:text-neutral-100 text-base">
          {module.name}
        </CardTitle>
        <span className="material-icons text-neutral-400">{module.icon}</span>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
          {module.description}
        </p>
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100"
            onClick={() => executeCommandMutation.mutate()}
            disabled={executeCommandMutation.isPending || !browserId}
          >
            {executeCommandMutation.isPending ? "Sending..." : "Execute"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandModuleCard;
