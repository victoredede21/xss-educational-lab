import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

const Resources = () => {
  return (
    <div className="p-6">
      {/* Educational Disclaimer */}
      <Alert className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <AlertTitle className="text-sm font-medium text-yellow-800">Educational Resources</AlertTitle>
            <AlertDescription className="mt-2 text-sm text-yellow-700">
              <p>These resources are provided to enhance your knowledge of web security and ethical hacking practices. Always practice security testing in authorized environments only.</p>
            </AlertDescription>
          </div>
        </div>
      </Alert>
      
      <h1 className="text-2xl font-bold mb-6">Security Resources & Learning Materials</h1>
      
      <Tabs defaultValue="online">
        <TabsList className="mb-6">
          <TabsTrigger value="online">Online Resources</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="tools">Security Tools</TabsTrigger>
          <TabsTrigger value="courses">Courses & Certifications</TabsTrigger>
        </TabsList>
        
        {/* Online Resources Tab */}
        <TabsContent value="online">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>OWASP Resources</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>The Open Web Application Security Project® (OWASP) is a nonprofit foundation that works to improve the security of software.</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP Top 10</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://owasp.org/www-community/attacks/xss/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP XSS Attack Description</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://cheatsheetseries.owasp.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP Cheat Sheet Series</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP Testing Guide</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://owasp.org/www-project-juice-shop/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP Juice Shop (Vulnerable App)</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>XSS & Browser Security</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Resources specifically focused on Cross-Site Scripting and browser security:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://portswigger.net/web-security/cross-site-scripting" target="_blank" rel="noopener noreferrer" className="hover:text-primary">PortSwigger XSS Guide</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://excess-xss.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Excess XSS - Comprehensive Tutorial</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" target="_blank" rel="noopener noreferrer" className="hover:text-primary">MDN: Content Security Policy</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://xsshunter.com/features" target="_blank" rel="noopener noreferrer" className="hover:text-primary">XSS Hunter</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection" target="_blank" rel="noopener noreferrer" className="hover:text-primary">PayloadsAllTheThings: XSS Payloads</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CTF Platforms & Practice Labs</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Capture The Flag competitions and practice platforms to hone your skills:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://portswigger.net/web-security/all-labs" target="_blank" rel="noopener noreferrer" className="hover:text-primary">PortSwigger Web Security Academy</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://www.hackthebox.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Hack The Box</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://tryhackme.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">TryHackMe</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://ctftime.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">CTFtime - CTF Events Calendar</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://google-gruyere.appspot.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Google Gruyere - Web App Exploits</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Blogs & News</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Stay updated with the latest security research and vulnerabilities:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://portswigger.net/research/articles" target="_blank" rel="noopener noreferrer" className="hover:text-primary">PortSwigger Research</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://blog.detectify.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Detectify Blog</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://thehackernews.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">The Hacker News</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://www.troyhunt.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Troy Hunt's Blog</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">article</span>
                    <a href="https://brutelogic.com.br/blog/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">BruteLogic XSS Blog</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Books Tab */}
        <TabsContent value="books">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Web Security Books</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Recommended books focusing on web application security:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"The Web Application Hacker's Handbook" by Dafydd Stuttard and Marcus Pinto</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Web Security for Developers" by Malcolm McDonald</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Real-World Bug Hunting" by Peter Yaworski</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"OWASP Testing Guide" (Available as free PDF)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"JavaScript for Hackers" by Gareth Heyes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>XSS & Browser Exploitation Books</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Books specifically focused on XSS and browser exploitation:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"XSS Attacks: Cross Site Scripting Exploits and Defense" by Seth Fogie, et al.</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Browser Hackers Handbook" by Wade Alcorn, et al.</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Tangled Web: A Guide to Securing Modern Web Applications" by Michal Zalewski</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"HTTP Security" by Scott Contini</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ethical Hacking & Security Books</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>General security and ethical hacking books:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Penetration Testing: A Hands-On Introduction to Hacking" by Georgia Weidman</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Bug Bounty Bootcamp" by Vickie Li</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Black Hat Python" by Justin Seitz</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Hacking: The Art of Exploitation" by Jon Erickson</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Engineering Books</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Books focusing on secure software development:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Security Engineering" by Ross Anderson</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Secure By Design" by Dan Bergh Johnsson, et al.</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Secure Programming Cookbook" by John Viega and Matt Messier</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">book</span>
                    <span>"Threat Modeling: Designing for Security" by Adam Shostack</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Security Tools Tab */}
        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Web Application Security Tools</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Essential tools for web application security testing:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://portswigger.net/burp" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Burp Suite</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://www.zaproxy.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP ZAP</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/s0md3v/XSStrike" target="_blank" rel="noopener noreferrer" className="hover:text-primary">XSStrike</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/OWASP/Amass" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP Amass</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://www.metasploit.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Metasploit Framework</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>XSS & Browser Tools</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Tools specifically for XSS testing and browser security:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://beefproject.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">BeEF (Browser Exploitation Framework)</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener noreferrer" className="hover:text-primary">DOMPurify</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/mandatoryprogrammer/xsshunter" target="_blank" rel="noopener noreferrer" className="hover:text-primary">XSS Hunter</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/LewisArdern/bXSS" target="_blank" rel="noopener noreferrer" className="hover:text-primary">bXSS (Blind XSS)</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/bugcrowd/HUNT" target="_blank" rel="noopener noreferrer" className="hover:text-primary">HUNT - Burp & ZAP extension</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Defensive Tools</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Tools for developers to help prevent security vulnerabilities:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/mozilla/observatory-cli" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Mozilla Observatory</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/presidentbeef/brakeman" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Brakeman</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/returntocorp/semgrep" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Semgrep</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://github.com/snyk/snyk" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Snyk</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://csp-evaluator.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">CSP Evaluator</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Network Security Tools</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Network reconnaissance and security tools:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://nmap.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Nmap</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://www.wireshark.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Wireshark</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://www.kali.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Kali Linux</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://www.aircrack-ng.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Aircrack-ng</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">security</span>
                    <a href="https://www.tcpdump.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">tcpdump</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Web Security Courses</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Recommended courses focused on web application security:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://portswigger.net/web-security" target="_blank" rel="noopener noreferrer" className="hover:text-primary">PortSwigger Web Security Academy</a> - Free
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.udemy.com/course/web-security-fundamentals/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Web Application Security Fundamentals</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.edx.org/professional-certificate/harvardx-cybersecurity-fundamentals" target="_blank" rel="noopener noreferrer" className="hover:text-primary">HarvardX Cybersecurity Fundamentals</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.pluralsight.com/paths/web-security" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Pluralsight Web Security Path</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Specialized XSS & Browser Security</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Focused courses on XSS and browser exploitation:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.pentesteracademy.com/course?id=11" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Browser Exploitation for Fun and Profit</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.elearnsecurity.com/course/web_application_penetration_testing/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">eLearnSecurity Web Application Penetration Testing</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://portswigger.net/web-security/cross-site-scripting" target="_blank" rel="noopener noreferrer" className="hover:text-primary">PortSwigger XSS Learning Path</a> - Free
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Industry-recognized security certifications:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">verified</span>
                    <a href="https://www.offensive-security.com/pwk-oscp/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OSCP - Offensive Security Certified Professional</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">verified</span>
                    <a href="https://www.offensive-security.com/awae-oswe/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OSWE - Offensive Security Web Expert</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">verified</span>
                    <a href="https://www.elearnsecurity.com/certification/ewptx/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">eWPTX - eLearnSecurity Web Penetration Tester eXtreme</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">verified</span>
                    <a href="https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">CEH - Certified Ethical Hacker</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">verified</span>
                    <a href="https://www.isc2.org/Certifications/CSSLP" target="_blank" rel="noopener noreferrer" className="hover:text-primary">CSSLP - Certified Secure Software Lifecycle Professional</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Free Learning Resources</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>High-quality free educational materials:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.hacker101.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Hacker101</a> - Free web security course
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://cybersecuritycourse.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Standford Free Cybersecurity Course</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://github.com/OWASP/NodeGoat" target="_blank" rel="noopener noreferrer" className="hover:text-primary">OWASP NodeGoat</a> - Learning Node.js security
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.youtube.com/c/LiveOverflow" target="_blank" rel="noopener noreferrer" className="hover:text-primary">LiveOverflow</a> - YouTube channel
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons text-primary text-sm mr-2">school</span>
                    <a href="https://www.youtube.com/c/JohnHammond010" target="_blank" rel="noopener noreferrer" className="hover:text-primary">John Hammond</a> - YouTube channel
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Legal & Ethical Considerations</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>When conducting security research or using security tools, always remember to:</p>
          <ul>
            <li>Only test systems you own or have explicit written permission to test</li>
            <li>Understand and follow responsible disclosure policies</li>
            <li>Be aware of laws like the Computer Fraud and Abuse Act (CFAA) in the US and similar laws in other countries</li>
            <li>Document your testing methodology and findings carefully</li>
            <li>Never use knowledge or tools for unauthorized or harmful purposes</li>
          </ul>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            This XSS Educational Lab is designed for educational purposes only. Using techniques demonstrated here against systems without explicit permission is illegal and unethical.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;
