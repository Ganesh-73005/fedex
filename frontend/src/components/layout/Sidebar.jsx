import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Scale,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, sidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'executive', 'compliance', 'dca_agent'] },
      { path: '/cases', icon: FolderKanban, label: 'Cases', roles: ['admin', 'compliance', 'dca_agent'] },
      { path: '/allocation', icon: Users, label: 'Allocation', roles: ['admin'] },
      { path: '/dca-portal', icon: Briefcase, label: 'DCA Portal', roles: ['admin', 'dca_agent'] },
      { path: '/compliance', icon: ShieldCheck, label: 'Compliance', roles: ['admin', 'compliance'] },
      { path: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
    ];

    return baseItems.filter(item => item.roles.includes(currentUser.role));
  };

  const navItems = getNavItems();

  return (
    <TooltipProvider delayDuration={0}>
      <aside 
        className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{ background: 'linear-gradient(180deg, hsl(220 35% 18%), hsl(220 35% 12%))' }}
      >
        {/* Logo Section */}
        <div className={`flex items-center h-16 px-4 border-b border-nav-muted ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-nav-foreground">CollectHub</h1>
                <p className="text-xs text-nav-foreground/60">Enterprise</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            const navContent = (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-nav-foreground/80 hover:bg-nav-muted hover:text-nav-foreground'
                } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'opacity-80'}`} />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    {navContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return navContent;
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-nav-muted">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={`w-full text-nav-foreground/70 hover:text-nav-foreground hover:bg-nav-muted ${
              sidebarCollapsed ? 'px-0 justify-center' : ''
            }`}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-nav-muted">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                {currentUser.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-nav-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-nav-foreground/60 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
