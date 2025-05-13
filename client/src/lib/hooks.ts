import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from './queryClient';
import { useQuery } from '@tanstack/react-query';
import { HookedBrowser, CommandModule, CommandExecution, Log } from '@shared/schema';

// Hook for WebSocket connection
export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  
  useEffect(() => {
    // Use the custom websocket path to avoid conflicts with Vite's WebSocket
    const wsUrl = `${url.replace(/^http/, 'ws')}/ws/xss-lab`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLastMessage(message);
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [url]);
  
  const sendMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
    }
  }, [socket, isConnected]);
  
  return { socket, isConnected, lastMessage, sendMessage };
}

// Hook for getting hooked browsers
export function useHookedBrowsers() {
  return useQuery({ 
    queryKey: ['/api/browsers'],
    staleTime: 10000
  });
}

// Hook for getting commands
export function useCommands() {
  return useQuery({ 
    queryKey: ['/api/commands'],
    staleTime: 60000
  });
}

// Hook for getting command categories
export function useCommandCategories() {
  return useQuery({ 
    queryKey: ['/api/commands/categories'],
    staleTime: 60000
  });
}

// Hook for getting commands by category
export function useCommandsByCategory(category: string) {
  return useQuery({ 
    queryKey: ['/api/commands/category', category],
    staleTime: 60000,
    enabled: !!category
  });
}

// Hook for getting logs
export function useLogs() {
  return useQuery({ 
    queryKey: ['/api/logs'],
    staleTime: 10000
  });
}

// Hook for getting logs by browser ID
export function useLogsByBrowser(browserId: number) {
  return useQuery({ 
    queryKey: ['/api/logs/browser', browserId],
    staleTime: 10000,
    enabled: !!browserId
  });
}

// Hook for getting command executions
export function useCommandExecutions() {
  return useQuery({ 
    queryKey: ['/api/executions'],
    staleTime: 10000
  });
}

// Hook for getting hook statistics
export function useHookStatistics() {
  return useQuery({ 
    queryKey: ['/api/hooks/count'],
    staleTime: 10000
  });
}

// Hook for screen size
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
}

// Hook for dark mode
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
