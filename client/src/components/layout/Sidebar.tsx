import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/context";
import { useCallback } from "react";

const Sidebar = () => {
  const [location] = useLocation();
  const { collapsed, toggleCollapsed } = useSidebar();
  
  const isActive = useCallback(
    (path: string) => location === path,
    [location]
  );

  return (
    <aside className={cn(
      "bg-neutral-800 text-neutral-100 transition-all duration-300 z-30 h-full",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-secondary">security</span>
          {!collapsed && (
            <h1 className="text-lg font-semibold">XSS Educational Lab</h1>
          )}
        </div>
        <button
          onClick={toggleCollapsed}
          className="text-neutral-400 hover:text-white"
        >
          <span className="material-icons">
            {collapsed ? "menu_open" : "menu"}
          </span>
        </button>
      </div>

      <div className="py-4">
        <div className={cn(
          "px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider",
          collapsed && "text-center px-0"
        )}>
          {!collapsed ? "Main" : ""}
        </div>
        
        <Link href="/">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">dashboard</span>
            {!collapsed && "Dashboard"}
          </a>
        </Link>
        
        <Link href="/hooked-browsers">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/hooked-browsers") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">devices</span>
            {!collapsed && "Hooked Browsers"}
          </a>
        </Link>
        
        <Link href="/commands">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/commands") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">code</span>
            {!collapsed && "Commands"}
          </a>
        </Link>
        
        <Link href="/logs">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/logs") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">receipt_long</span>
            {!collapsed && "Logs"}
          </a>
        </Link>
        
        <div className={cn(
          "mt-6 px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider",
          collapsed && "text-center px-0"
        )}>
          {!collapsed ? "Educational" : ""}
        </div>
        
        <Link href="/tutorials">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/tutorials") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">school</span>
            {!collapsed && "Tutorials"}
          </a>
        </Link>
        
        <Link href="/prevention">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/prevention") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">security</span>
            {!collapsed && "Prevention"}
          </a>
        </Link>
        
        <Link href="/resources">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/resources") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">book</span>
            {!collapsed && "Resources"}
          </a>
        </Link>
        
        <div className={cn(
          "mt-6 px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider",
          collapsed && "text-center px-0"
        )}>
          {!collapsed ? "Settings" : ""}
        </div>
        
        <Link href="/settings">
          <a className={cn(
            "flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700",
            isActive("/settings") && "text-neutral-100 bg-primary hover:bg-primary-dark"
          )}>
            <span className="material-icons mr-3">settings</span>
            {!collapsed && "Configuration"}
          </a>
        </Link>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-neutral-700">
        <div className="text-xs text-center text-neutral-400">
          <p>Educational Use Only</p>
          {!collapsed && <p className="mt-1">© XSS Educational Lab</p>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
