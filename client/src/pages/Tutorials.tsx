import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

const Tutorials = () => {
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
              <p>These tutorials are provided for educational purposes only. Always practice security testing ethically and legally in controlled environments with proper authorization.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      <h1 className="text-2xl font-bold mb-6">XSS Tutorials and Learning Resources</h1>
      
      <Tabs defaultValue="intro">
        <TabsList className="mb-6">
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="types">XSS Types</TabsTrigger>
          <TabsTrigger value="hooks">Using Hooks</TabsTrigger>
          <TabsTrigger value="prevention">Prevention</TabsTrigger>
        </TabsList>
        
        {/* Introduction Tab */}
        <TabsContent value="intro">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What is Cross-Site Scripting (XSS)?</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Cross-Site Scripting (XSS) is a type of security vulnerability that allows attackers to inject malicious scripts into web pages viewed by others. These scripts execute in the victim's browser, potentially giving the attacker access to cookies, session tokens, or other sensitive information.
              </p>
              
              <h3>How XSS Works</h3>
              <p>
                XSS attacks occur when an application takes untrusted data and sends it to a web browser without proper validation or escaping. Attackers can use XSS to send malicious script to an unsuspecting user, whose browser has no way to know the script shouldn't be trusted and will execute it.
              </p>
              
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Basic XSS Example:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`<script>alert("XSS Attack!");</script>`}</code>
                </pre>
                <p className="text-sm mt-2">
                  If a website allows this code to be inserted into a page and doesn't properly sanitize it, all users who view the page will see an alert dialog.
                </p>
              </div>
              
              <h3>Impact of XSS Vulnerabilities</h3>
              <ul>
                <li>Stealing session cookies and impersonating users</li>
                <li>Capturing keystrokes to steal passwords</li>
                <li>Redirecting users to phishing sites</li>
                <li>Defacing websites or inserting unwanted content</li>
                <li>Performing actions on behalf of the victim</li>
              </ul>
              
              <h3>XSS in the Security Landscape</h3>
              <p>
                XSS remains one of the most common web application vulnerabilities. According to the OWASP Top 10, it's consistently ranked among the most dangerous web application security risks. Understanding XSS is essential for any web developer or security professional.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* XSS Types Tab */}
        <TabsContent value="types">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Types of Cross-Site Scripting</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <h3>1. Reflected XSS</h3>
              <p>
                Reflected XSS occurs when malicious script is reflected off a web server, such as in an error message, search result, or any other response that includes some or all of the input sent to the server as part of the request.
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Example:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`https://example.com/search?term=<script>alert("XSS")</script>`}</code>
                </pre>
                <p className="text-sm mt-2">
                  If the server echoes back "Results for: [term]" without proper sanitization, the script will execute.
                </p>
              </div>
              
              <h3>2. Stored XSS</h3>
              <p>
                Stored XSS (also known as persistent XSS) occurs when the malicious script is stored on the target server, such as in a database, message forum, visitor log, or comment field. Every user who views the affected page will be exposed to the attack.
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Example:</h4>
                <p className="text-sm">
                  An attacker posts a comment on a blog with embedded JavaScript. The comment is stored in the database and displayed to all users who view the post.
                </p>
              </div>
              
              <h3>3. DOM-based XSS</h3>
              <p>
                DOM-based XSS occurs when the vulnerability exists in client-side code rather than server-side code. The page's JavaScript interacts with an attacker-controllable source such as URL parameters and insecurely updates the DOM.
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Example:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`<script>
  var pos = document.URL.indexOf("name=") + 5;
  document.write(document.URL.substring(pos, document.URL.length));
</script>`}</code>
                </pre>
                <p className="text-sm mt-2">
                  If a URL contains "name=<script>alert('XSS')</script>", the script will be written to the page and executed.
                </p>
              </div>
              
              <h3>4. Blind XSS</h3>
              <p>
                Blind XSS is similar to stored XSS, but occurs when the injected payload is stored and executed in a different context or application that isn't immediately visible to the attacker, such as admin panels, logs, or customer service platforms.
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Example:</h4>
                <p className="text-sm">
                  An attacker submits a form with malicious JavaScript. The submitted data is later viewed by administrators in a dashboard where the script executes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Using Hooks Tab */}
        <TabsContent value="hooks">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Understanding JavaScript Hooks</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                JavaScript hooks are a technique used in security research to maintain a connection with a compromised browser after a successful XSS attack. This educational lab demonstrates how hooks work for learning purposes.
              </p>
              
              <h3>How JavaScript Hooks Work</h3>
              <p>
                A hook typically consists of JavaScript code that creates a persistent connection between the compromised browser and an attacker's server. This allows the attacker to:
              </p>
              <ul>
                <li>Send commands to the browser in real-time</li>
                <li>Extract information from the browser</li>
                <li>Monitor user activity</li>
                <li>Perform actions in the context of the user's session</li>
              </ul>
              
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Basic Hook Implementation:</h4>
                <ol className="list-decimal pl-5 mb-0">
                  <li>Initial XSS payload injects a script tag pointing to the hook.js file</li>
                  <li>hook.js establishes a connection back to the command server</li>
                  <li>The connection is maintained through polling or WebSockets</li>
                  <li>Hook receives and executes commands from the server</li>
                  <li>Results are sent back to the command server</li>
                </ol>
              </div>
              
              <h3>Using This Educational Lab</h3>
              <p>
                This lab provides a controlled environment to understand how JavaScript hooks work:
              </p>
              <ol>
                <li>
                  <strong>Get Hook Code:</strong> Access the hook code from the dashboard or browsers page
                </li>
                <li>
                  <strong>Create a Test Environment:</strong> Set up a local, controlled test page with an intentional XSS vulnerability
                </li>
                <li>
                  <strong>Inject the Hook:</strong> Use the hook code in your controlled environment
                </li>
                <li>
                  <strong>Observe the Connection:</strong> Watch as the browser connects to the dashboard
                </li>
                <li>
                  <strong>Experiment with Commands:</strong> Try different commands to understand their capabilities
                </li>
              </ol>
              
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2 text-red-800 dark:text-red-300">Important Ethics & Legal Notice:</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-0">
                  This lab is for educational use only. Never use these techniques against websites or systems without explicit written permission. Unauthorized testing is illegal and unethical, potentially violating:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 mt-2 mb-0">
                  <li>Computer Fraud and Abuse Act (CFAA)</li>
                  <li>State and international computer crime laws</li>
                  <li>Terms of service agreements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Prevention Tab */}
        <TabsContent value="prevention">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>XSS Prevention Techniques</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Preventing XSS vulnerabilities is essential for building secure web applications. This section covers key prevention techniques that every developer should implement.
              </p>
              
              <h3>Input Validation and Sanitization</h3>
              <p>
                Always validate and sanitize user inputs, preferably with whitelisting approaches:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Examples:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`// JavaScript example using DOMPurify
import DOMPurify from 'dompurify';

const userInput = '<script>alert("XSS")</script>';
const sanitizedInput = DOMPurify.sanitize(userInput);
// Result: sanitizedInput will not contain the script tag`}</code>
                </pre>
              </div>
              
              <h3>Output Encoding</h3>
              <p>
                Always encode data before inserting it into HTML, JavaScript, CSS, or URLs:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Examples:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`// React automatically escapes values in JSX
const userComment = '<script>alert("XSS")</script>';
return <div>{userComment}</div>;
// Result: Renders as text, not executed script

// PHP example
$userInput = '<script>alert("XSS")</script>';
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
// Result: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;`}</code>
                </pre>
              </div>
              
              <h3>Content Security Policy (CSP)</h3>
              <p>
                Implement CSP headers to restrict the sources of executable scripts:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <h4 className="text-base font-semibold mb-2">Example CSP Header:</h4>
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com`}</code>
                </pre>
                <p className="text-sm mt-2">
                  This policy allows scripts only from the same origin and trusted-cdn.com.
                </p>
              </div>
              
              <h3>Use Modern Frameworks</h3>
              <p>
                Modern frameworks like React, Angular, and Vue automatically escape content by default, providing some protection against XSS:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`// React example
function Comment({ text }) {
  return <div>{text}</div>; // Automatically escaped
}

// But be careful with:
function UnsafeComment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />; // XSS risk!
}`}</code>
                </pre>
              </div>
              
              <h3>HTTP-only Cookies</h3>
              <p>
                Set cookies with the HttpOnly flag to prevent JavaScript from accessing sensitive cookies:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md my-4">
                <pre className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded overflow-x-auto">
                  <code>{`// Node.js example
res.cookie('sessionId', 'abc123', { 
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});`}</code>
                </pre>
              </div>
              
              <h3>XSS Testing Tools</h3>
              <p>
                Regularly test your application for XSS vulnerabilities:
              </p>
              <ul>
                <li>OWASP ZAP</li>
                <li>Burp Suite</li>
                <li>XSS Hunter</li>
                <li>Automated security scanning in your CI/CD pipeline</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tutorials;
