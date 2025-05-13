import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle } from "lucide-react";

const Prevention = () => {
  return (
    <div className="p-6">
      {/* Educational Disclaimer */}
      <Alert className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <AlertTitle className="text-sm font-medium text-yellow-800">Educational Resource</AlertTitle>
            <AlertDescription className="mt-2 text-sm text-yellow-700">
              <p>This page provides guidance on preventing XSS vulnerabilities in your applications. Learning how to secure applications is an essential component of security education.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      <h1 className="text-2xl font-bold mb-6">XSS Prevention Guide</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>OWASP XSS Prevention Cheat Sheet</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              The following prevention rules are based on the <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">OWASP XSS Prevention Cheat Sheet</a> and provide a comprehensive approach to preventing XSS vulnerabilities.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rule #0: Never Insert Untrusted Data</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Never insert untrusted data except in allowed locations. Don't put untrusted data directly in scripts, HTML comments, attribute names, tag names, or directly in CSS.
            </p>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded my-3">
              <h4 className="text-sm font-bold text-red-800 dark:text-red-200 mb-1">Dangerous Code:</h4>
              <pre className="text-xs bg-neutral-200 dark:bg-neutral-900 p-2 rounded overflow-x-auto">
<code>{`<script>
  var x = "<%= userInput %>";
</script>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rule #1: HTML Escape</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              HTML escape untrusted data before inserting it into HTML element content.
            </p>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded my-3">
              <h4 className="text-sm font-bold text-green-800 dark:text-green-200 mb-1">Safe Code:</h4>
              <pre className="text-xs bg-neutral-200 dark:bg-neutral-900 p-2 rounded overflow-x-auto">
<code>{`<div>
  <%= htmlEscape(userInput) %>
</div>`}</code>
              </pre>
            </div>
            <p className="text-sm">Convert: <code>&</code> to <code>&amp;amp;</code>, <code>{'<'}</code> to <code>&amp;lt;</code>, <code>{'>'}</code> to <code>&amp;gt;</code>, <code>"</code> to <code>&amp;quot;</code>, <code>'</code> to <code>&amp;#x27;</code></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rule #2: Attribute Escape</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Attribute escape untrusted data before inserting it into HTML common attributes.
            </p>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded my-3">
              <h4 className="text-sm font-bold text-green-800 dark:text-green-200 mb-1">Safe Code:</h4>
              <pre className="text-xs bg-neutral-200 dark:bg-neutral-900 p-2 rounded overflow-x-auto">
<code>{`<div attr="<%= attributeEscape(userInput) %>">
  Content
</div>`}</code>
              </pre>
            </div>
            <p className="text-sm">Except for alphanumeric characters, escape all characters with the HTML entity <code>&amp;#xHH;</code> format</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detailed Prevention Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Input Validation</AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                <p>
                  Input validation is the first line of defense against XSS attacks. While it shouldn't be relied upon as the sole security measure, it can help filter out obviously malicious data.
                </p>
                <h4>Principles:</h4>
                <ul>
                  <li>Prefer whitelisting over blacklisting</li>
                  <li>Validate data type, length, format, and range</li>
                  <li>Validate on the server-side (client-side validation can be bypassed)</li>
                </ul>
                <h4>Example (Node.js with Express Validator):</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`const { body, validationResult } = require('express-validator');

app.post('/comment',
  // Validate input
  body('username').isAlphanumeric().isLength({ min: 3, max: 30 }),
  body('comment').isLength({ min: 1, max: 500 }).escape(),
  
  // Process request
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Process valid data
    saveComment(req.body.username, req.body.comment);
    res.redirect('/comments');
  }
);`}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Output Encoding</AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                <p>
                  Output encoding is the primary defense against XSS. It converts special characters into their display equivalents rather than allowing them to be interpreted as code.
                </p>
                <h4>Context-Specific Encoding:</h4>
                <ul>
                  <li>HTML context: Encode <code>&amp;</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&quot;</code>, <code>&#39;</code></li>
                  <li>HTML attribute context: Encode all non-alphanumeric characters</li>
                  <li>JavaScript context: Use JSON.stringify() or escape sequences</li>
                  <li>CSS context: Hex encode all non-alphanumeric characters</li>
                  <li>URL context: Use encodeURIComponent()</li>
                </ul>
                <h4>Example (React):</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`// HTML context - React automatically escapes this
return <div>{userProvidedData}</div>;

// HTML attribute context
return <div title={userProvidedData}></div>;

// JavaScript context - be careful here
return <button onClick={() => handleAction(userProvidedData)}>Click</button>;

// Dangerous - never do this
return <div dangerouslySetInnerHTML={{ __html: userProvidedData }} />;`}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Content Security Policy (CSP)</AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                <p>
                  Content Security Policy is a browser security feature that helps mitigate XSS attacks by controlling which resources can be loaded and executed on your page.
                </p>
                <h4>Key Directives:</h4>
                <ul>
                  <li><code>default-src</code>: Fallback for other resource types</li>
                  <li><code>script-src</code>: Valid sources for JavaScript</li>
                  <li><code>style-src</code>: Valid sources for stylesheets</li>
                  <li><code>img-src</code>: Valid sources for images</li>
                  <li><code>connect-src</code>: Valid targets for fetch, XHR, WebSocket</li>
                  <li><code>frame-src</code>: Valid sources for frames</li>
                </ul>
                <h4>Example (Express.js with helmet):</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`const helmet = require('helmet');
const express = require('express');
const app = express();

// Set CSP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted-cdn.com"],
      styleSrc: ["'self'", "https://trusted-cdn.com", "'unsafe-inline'"],
      imgSrc: ["'self'", "https://trusted-cdn.com", "data:"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Your routes here
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000);`}</code>
                </pre>

                <h4>Testing Your CSP:</h4>
                <p>
                  Use the <a href="https://csp-evaluator.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">CSP Evaluator</a> to check the effectiveness of your Content Security Policy.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>HttpOnly Cookies</AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                <p>
                  Using HttpOnly cookies helps mitigate the impact of XSS attacks by preventing JavaScript from accessing sensitive cookies like session identifiers.
                </p>
                <h4>Example (Express.js):</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`const express = require('express');
const session = require('express-session');
const app = express();

app.use(
  session({
    secret: 'your-secret-key',
    name: 'sessionId',
    cookie: {
      httpOnly: true,     // Prevents JavaScript access
      secure: true,       // Requires HTTPS
      sameSite: 'strict', // Prevents CSRF
      maxAge: 3600000     // 1 hour
    }
  })
);

app.get('/', (req, res) => {
  // Session is accessible on the server
  req.session.views = (req.session.views || 0) + 1;
  res.send(\`Viewed \${req.session.views} times\`);
});

app.listen(3000);`}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Framework-Specific Protections</AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                <p>
                  Modern frameworks include built-in protections against XSS, but it's important to understand how they work and their limitations.
                </p>
                
                <h4>React:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`// Safe - React escapes values in expressions
function Comment({ text }) {
  return <div>{text}</div>;
}

// Dangerous - bypasses React's protections
function UnsafeComment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}`}</code>
                </pre>
                
                <h4>Angular:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`<!-- Safe - Angular automatically sanitizes -->
<div>{{ userComment }}</div>

<!-- Dangerous - bypasses Angular's sanitization -->
<div [innerHTML]="userComment"></div>`}</code>
                </pre>
                
                <h4>Vue:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
<code>{`<!-- Safe - Vue escapes interpolated content -->
<div>{{ userComment }}</div>

<!-- Dangerous - raw HTML insertion -->
<div v-html="userComment"></div>`}</code>
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <ul>
            <li>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
                OWASP XSS Prevention Cheat Sheet
              </a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
                MDN Web Docs: Content Security Policy
              </a>
            </li>
            <li>
              <a href="https://portswigger.net/web-security/cross-site-scripting" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
                PortSwigger Web Security Academy: XSS
              </a>
            </li>
            <li>
              <a href="https://github.com/OWASP/CheatSheetSeries" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
                OWASP CheatSheet Series GitHub Repository
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prevention;
