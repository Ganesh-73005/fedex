import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApp } from '../../context/AppContext';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
