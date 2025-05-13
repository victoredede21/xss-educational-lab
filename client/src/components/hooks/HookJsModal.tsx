import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getBaseUrl, generateHookCode } from "@/lib/utils";

interface HookJsModalProps {
  onClose: () => void;
}

const HookJsModal = ({ onClose }: HookJsModalProps) => {
  const [hookCode, setHookCode] = useState("");
  const { toast } = useToast();
  
  // Get hook code from API
  const hookCodeQuery = useQuery({
    queryKey: ['/api/hookjs'],
    onSuccess: (data) => {
      if (data.code) {
        setHookCode(data.code);
      } else {
        setHookCode(generateHookCode(getBaseUrl()));
      }
    },
    onError: () => {
      setHookCode(generateHookCode(getBaseUrl()));
    }
  });
  
  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(hookCode)
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
        
        <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-md overflow-auto max-h-[400px]">
          <pre className="text-sm font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
            {hookCodeQuery.isLoading 
              ? "Loading hook code..." 
              : hookCode}
          </pre>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
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
          <Button onClick={copyCode}>Copy Code</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HookJsModal;
