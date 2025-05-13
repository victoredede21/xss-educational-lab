import { CommandModule } from "@shared/schema";
import { storage } from "./storage";

// Execute a command on a hooked browser and return the result
export async function executeCommand(browserId: number, moduleId: number): Promise<any> {
  try {
    // Get the command module
    const module = await storage.getCommandModule(moduleId);
    if (!module) {
      throw new Error(`Command module ${moduleId} not found`);
    }
    
    // Create an execution record
    const execution = await storage.createCommandExecution({
      browserId,
      moduleId,
      result: null,
      status: "pending"
    });
    
    // Log the command execution
    await storage.createLog({
      browserId,
      event: "command_sent",
      details: { executionId: execution.id, moduleId },
      level: "info"
    });
    
    return {
      success: true,
      executionId: execution.id
    };
  } catch (error) {
    console.error("Command execution error:", error);
    
    // Log the error
    await storage.createLog({
      browserId,
      event: "command_error",
      details: { error: (error as Error).message, moduleId },
      level: "error"
    });
    
    return {
      success: false,
      error: (error as Error).message
    };
  }
}
