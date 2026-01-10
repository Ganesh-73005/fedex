import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  UserCircle,
  LogOut,
  Settings,
  Shield,
  Briefcase,
  Users,
  Clock,
  AlertTriangle,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { roles } from '../../data/mockData';

const TopBar = () => {
  const { currentUser, switchRole, notifications, markNotificationRead } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'admin': return Shield;
      case 'dca_agent': return Briefcase;
      case 'compliance': return Users;
      case 'executive': return Building2;
      default: return UserCircle;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'sla': return <Clock className="w-4 h-4 text-warning" />;
      case 'escalation': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-success" />;
      case 'assignment': return <Users className="w-4 h-4 text-primary" />;
      case 'compliance': return <Shield className="w-4 h-4 text-info" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cases, customers, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Organization Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">FedEx Collections</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Organization</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
              FedEx Collections
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-primary-light' : ''
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Role Switcher / User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                {currentUser.avatar}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map((role) => {
              const RoleIcon = getRoleIcon(role.id);
              return (
                <DropdownMenuItem
                  key={role.id}
                  onClick={() => switchRole(role.id)}
                  className="gap-2"
                >
                  <RoleIcon className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  {currentUser.role === role.id && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive">
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
