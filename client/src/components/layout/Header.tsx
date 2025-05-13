import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSidebar, useTheme } from '@/lib/context';
import { useQuery } from '@tanstack/react-query';
import HookJsModal from '@/components/hooks/HookJsModal';

const Header = () => {
  const [location] = useLocation();
  const { toggleCollapsed } = useSidebar();
  const { isDark, toggleTheme } = useTheme();
  const [showHookModal, setShowHookModal] = useState(false);
  
  // Get page title based on location
  const getPageTitle = () => {
    switch (location) {
      case '/': return 'Dashboard';
      case '/hooked-browsers': return 'Hooked Browsers';
      case '/commands': return 'Commands';
      case '/logs': return 'Logs';
      case '/tutorials': return 'Tutorials';
      case '/prevention': return 'Prevention';
      case '/resources': return 'Resources';
      case '/settings': return 'Configuration';
      default: return 'Dashboard';
    }
  };
  
  // Hook status query
  const hookStatusQuery = useQuery({
    queryKey: ['/api/hooks/count'],
    refetchInterval: 5000
  });
  
  const hookActive = hookStatusQuery.data?.active > 0;
  
  return (
    <header className="bg-white dark:bg-neutral-800 shadow">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleCollapsed}
            className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light"
          >
            <span className="material-icons">menu</span>
          </button>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
            {getPageTitle()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`text-sm flex items-center px-3 py-1 rounded-full ${hookActive ? 'text-green-600 bg-green-100 dark:bg-green-900' : 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'}`}>
            <span className={`block w-2 h-2 rounded-full mr-2 ${hookActive ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            {hookActive ? 'Hook Server Active' : 'No Active Hooks'}
          </span>
          
          <button 
            onClick={() => setShowHookModal(true)}
            className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light"
            title="Get Hook Code"
          >
            <span className="material-icons">code</span>
          </button>
          
          <div className="relative">
            <button className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light">
              <span className="material-icons">notifications</span>
            </button>
            {hookStatusQuery.data?.active > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-secondary rounded-full text-xs text-white flex items-center justify-center">
                {hookStatusQuery.data?.active}
              </span>
            )}
          </div>
          
          <button 
            onClick={toggleTheme}
            className="text-neutral-700 dark:text-neutral-200 hover:text-primary dark:hover:text-primary-light"
          >
            <span className="material-icons">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>
      
      {showHookModal && <HookJsModal onClose={() => setShowHookModal(false)} />}
    </header>
  );
};

export default Header;
