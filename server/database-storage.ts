import { 
  User, InsertUser, 
  HookedBrowser, InsertHookedBrowser, 
  CommandModule, InsertCommandModule,
  CommandExecution, InsertCommandExecution,
  Log, InsertLog,
  users, hookedBrowsers, commandModules, commandExecutions, logs
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";

/**
 * Implementation of the storage interface using PostgreSQL database
 */
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // Hooked browser operations
  async getHookedBrowser(id: number): Promise<HookedBrowser | undefined> {
    const [browser] = await db.select().from(hookedBrowsers).where(eq(hookedBrowsers.id, id));
    return browser;
  }

  async getHookedBrowserBySessionId(sessionId: string): Promise<HookedBrowser | undefined> {
    const [browser] = await db.select().from(hookedBrowsers).where(eq(hookedBrowsers.sessionId, sessionId));
    return browser;
  }

  async createHookedBrowser(browser: InsertHookedBrowser): Promise<HookedBrowser> {
    const [createdBrowser] = await db.insert(hookedBrowsers).values(browser).returning();
    return createdBrowser;
  }

  async updateHookedBrowser(id: number, browser: Partial<HookedBrowser>): Promise<HookedBrowser | undefined> {
    const [updatedBrowser] = await db
      .update(hookedBrowsers)
      .set(browser)
      .where(eq(hookedBrowsers.id, id))
      .returning();
    return updatedBrowser;
  }

  async listHookedBrowsers(): Promise<HookedBrowser[]> {
    return await db.select().from(hookedBrowsers);
  }

  async deleteHookedBrowser(id: number): Promise<boolean> {
    try {
      await db.delete(hookedBrowsers).where(eq(hookedBrowsers.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting hooked browser:", error);
      return false;
    }
  }
  
  // Command module operations
  async getCommandModule(id: number): Promise<CommandModule | undefined> {
    const [module] = await db.select().from(commandModules).where(eq(commandModules.id, id));
    return module;
  }

  async createCommandModule(module: InsertCommandModule): Promise<CommandModule> {
    const [createdModule] = await db.insert(commandModules).values(module).returning();
    return createdModule;
  }

  async updateCommandModule(id: number, module: Partial<CommandModule>): Promise<CommandModule | undefined> {
    const [updatedModule] = await db
      .update(commandModules)
      .set(module)
      .where(eq(commandModules.id, id))
      .returning();
    return updatedModule;
  }

  async listCommandModules(): Promise<CommandModule[]> {
    return await db.select().from(commandModules);
  }

  async listCommandModulesByCategory(category: string): Promise<CommandModule[]> {
    return await db.select().from(commandModules).where(eq(commandModules.category, category));
  }

  async deleteCommandModule(id: number): Promise<boolean> {
    try {
      await db.delete(commandModules).where(eq(commandModules.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting command module:", error);
      return false;
    }
  }
  
  // Command execution operations
  async getCommandExecution(id: number): Promise<CommandExecution | undefined> {
    const [execution] = await db.select().from(commandExecutions).where(eq(commandExecutions.id, id));
    return execution;
  }

  async createCommandExecution(execution: InsertCommandExecution): Promise<CommandExecution> {
    const [createdExecution] = await db.insert(commandExecutions).values(execution).returning();
    return createdExecution;
  }

  async updateCommandExecution(id: number, execution: Partial<CommandExecution>): Promise<CommandExecution | undefined> {
    const [updatedExecution] = await db
      .update(commandExecutions)
      .set(execution)
      .where(eq(commandExecutions.id, id))
      .returning();
    return updatedExecution;
  }

  async listCommandExecutions(): Promise<CommandExecution[]> {
    return await db.select().from(commandExecutions);
  }

  async listCommandExecutionsByBrowser(browserId: number): Promise<CommandExecution[]> {
    return await db.select().from(commandExecutions).where(eq(commandExecutions.browserId, browserId));
  }
  
  // Log operations
  async getLog(id: number): Promise<Log | undefined> {
    const [log] = await db.select().from(logs).where(eq(logs.id, id));
    return log;
  }

  async createLog(logEntry: InsertLog): Promise<Log> {
    const [createdLog] = await db.insert(logs).values(logEntry).returning();
    return createdLog;
  }

  async listLogs(): Promise<Log[]> {
    return await db.select().from(logs);
  }

  async listLogsByBrowser(browserId: number): Promise<Log[]> {
    return await db.select().from(logs).where(eq(logs.browserId, browserId));
  }

  // Initialize database with default command modules if needed
  async initializeDefaultCommandModules() {
    // Check if we have any command modules already
    const existingModules = await db.select().from(commandModules);
    
    if (existingModules.length === 0) {
      console.log("Initializing default command modules...");
      
      // Define default modules
      const defaultModules: InsertCommandModule[] = [
        {
          name: 'Get Browser Details',
          description: 'Retrieve detailed information about the hooked browser',
          category: 'Information Gathering',
          icon: 'info',
          code: `
            (() => {
              // Educational demonstration only
              const browserInfo = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookiesEnabled: navigator.cookieEnabled,
                vendor: navigator.vendor,
                vendorSub: navigator.vendorSub,
                onLine: navigator.onLine,
                doNotTrack: navigator.doNotTrack,
                javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
                screen: {
                  width: screen.width,
                  height: screen.height,
                  availWidth: screen.availWidth,
                  availHeight: screen.availHeight,
                  colorDepth: screen.colorDepth,
                  pixelDepth: screen.pixelDepth
                }
              };
              return browserInfo;
            })();
          `
        },
        {
          name: 'Get Installed Plugins',
          description: 'List all browser plugins and extensions',
          category: 'Information Gathering',
          icon: 'info',
          code: `
            (() => {
              // Educational demonstration only
              const plugins = [];
              if (navigator.plugins) {
                for(let i = 0; i < navigator.plugins.length; i++) {
                  const plugin = navigator.plugins[i];
                  plugins.push({
                    name: plugin.name,
                    description: plugin.description,
                    filename: plugin.filename
                  });
                }
              }
              return { plugins };
            })();
          `
        },
        {
          name: 'Get System Information',
          description: 'Gather information about the system running the browser',
          category: 'Information Gathering',
          icon: 'info',
          code: `
            (() => {
              // Educational demonstration only
              return {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                screenResolution: {
                  width: screen.width,
                  height: screen.height
                },
                colorDepth: screen.colorDepth,
                devicePixelRatio: window.devicePixelRatio || 1,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                cores: navigator.hardwareConcurrency || 'unknown'
              };
            })();
          `
        },
        {
          name: 'Keystroke Logger (Educational)',
          description: 'Demonstrate how keystroke logging works in a controlled environment',
          category: 'Information Gathering',
          icon: 'keyboard',
          code: `
            (() => {
              // Educational demonstration only
              let keystrokes = [];
              let isLogging = false;
              
              // Create UI elements
              const loggerDiv = document.createElement('div');
              loggerDiv.id = 'xss-keylogger-demo';
              loggerDiv.style.position = 'fixed';
              loggerDiv.style.bottom = '20px';
              loggerDiv.style.right = '20px';
              loggerDiv.style.width = '300px';
              loggerDiv.style.padding = '15px';
              loggerDiv.style.backgroundColor = '#f8f9fa';
              loggerDiv.style.border = '1px solid #ddd';
              loggerDiv.style.borderRadius = '5px';
              loggerDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
              loggerDiv.style.zIndex = '9999';
              loggerDiv.style.fontFamily = 'Arial, sans-serif';
              
              loggerDiv.innerHTML = \`
                <div style="margin-bottom:10px; font-weight:bold; color:#721c24; background-color:#f8d7da; padding:5px; border-radius:3px; text-align:center;">
                  EDUCATIONAL KEYSTROKE LOGGER DEMO
                </div>
                <div style="margin-bottom:10px;">
                  <button id="start-logging" style="padding:5px 10px; background:#28a745; color:white; border:none; border-radius:3px; cursor:pointer; margin-right:5px;">Start Demo</button>
                  <button id="stop-logging" style="padding:5px 10px; background:#dc3545; color:white; border:none; border-radius:3px; cursor:pointer; display:none;">Stop Demo</button>
                </div>
                <div style="font-size:12px; margin-bottom:10px;">Type in the field below to see keylogging in action:</div>
                <input type="text" id="demo-input" style="width:100%; padding:5px; margin-bottom:10px; border:1px solid #ced4da; border-radius:3px;" placeholder="Type here...">
                <div style="font-size:12px; margin-bottom:5px;">Captured keystrokes:</div>
                <div id="keystroke-log" style="height:100px; overflow-y:auto; border:1px solid #ced4da; padding:5px; font-family:monospace; font-size:12px; background:#f5f5f5;">
                  Click "Start Demo" to begin...
                </div>
                <div style="font-size:11px; margin-top:10px; color:#6c757d;">For educational purposes only. In real-world attacks, this would happen invisibly.</div>
              \`;
              
              document.body.appendChild(loggerDiv);
              
              // Set up event handlers
              document.getElementById('start-logging').addEventListener('click', function() {
                document.getElementById('start-logging').style.display = 'none';
                document.getElementById('stop-logging').style.display = 'inline-block';
                document.getElementById('keystroke-log').innerHTML = 'Logging started...<br>';
                keystrokes = [];
                isLogging = true;
              });
              
              document.getElementById('stop-logging').addEventListener('click', function() {
                document.getElementById('stop-logging').style.display = 'none';
                document.getElementById('start-logging').style.display = 'inline-block';
                isLogging = false;
                document.getElementById('keystroke-log').innerHTML += '<br>Logging stopped.<br>';
              });
              
              // Set up the keylogger
              function handleKeyPress(e) {
                if (!isLogging) return;
                
                const key = e.key;
                const target = e.target.tagName;
                const timestamp = new Date().toLocaleTimeString();
                
                keystrokes.push({key, target, timestamp});
                
                let logElement = document.getElementById('keystroke-log');
                logElement.innerHTML += \`[\${timestamp}] \${key}<br>\`;
                logElement.scrollTop = logElement.scrollHeight;
              }
              
              // Only log keys from the demo input to be ethical
              document.getElementById('demo-input').addEventListener('keydown', handleKeyPress);
              
              return { success: true, message: 'Keystroke logger demonstration activated' };
            })();
          `
        },
        {
          name: 'Create Alert Dialog',
          description: 'Display an alert dialog on the hooked browser',
          category: 'DOM Manipulation',
          icon: 'html',
          code: `
            (() => {
              // Educational demonstration only
              alert('This is an educational XSS demonstration');
              return { success: true, message: 'Alert displayed successfully' };
            })();
          `
        },
        {
          name: 'Replace Page Content',
          description: 'Replace the entire page content with a custom message',
          category: 'DOM Manipulation',
          icon: 'html',
          code: `
            (() => {
              // Educational demonstration only
              const originalContent = document.body.innerHTML;
              document.body.innerHTML = '<div style="padding: 20px; background-color: #f8d7da; color: #721c24; text-align: center; font-family: Arial; margin: 10px;">' +
                '<h2>Educational XSS Demonstration</h2>' +
                '<p>This page has been modified through an XSS vulnerability demonstration.</p>' +
                '<p>In a real attack, the attacker could steal your data or perform actions on your behalf.</p>' +
                '<button onclick="document.body.innerHTML = originalContent" style="padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Restore Original Content</button>' +
                '</div>';
              return { success: true, message: 'Page content replaced' };
            })();
          `
        },
        {
          name: 'Inject HTML Element',
          description: 'Inject a new HTML element into the page',
          category: 'DOM Manipulation',
          icon: 'html',
          code: `
            (() => {
              // Educational demonstration only
              const div = document.createElement('div');
              div.id = 'xss-demo-banner';
              div.style.position = 'fixed';
              div.style.top = '0';
              div.style.left = '0';
              div.style.width = '100%';
              div.style.padding = '10px';
              div.style.backgroundColor = '#cce5ff';
              div.style.color = '#004085';
              div.style.textAlign = 'center';
              div.style.zIndex = '9999';
              div.style.fontFamily = 'Arial, sans-serif';
              div.innerHTML = 'Educational XSS Demonstration - This banner was injected via a simulated XSS vulnerability';
              document.body.appendChild(div);
              return { success: true, element: 'div#xss-demo-banner' };
            })();
          `
        }
      ];
      
      // Insert all the default modules
      for (const module of defaultModules) {
        await this.createCommandModule(module);
      }
      
      console.log(`Initialized ${defaultModules.length} default command modules`);
    }
  }
}