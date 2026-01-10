import React, { createContext, useContext, useState, useCallback } from 'react';
import { currentUser as defaultUser, cases as initialCases, dcaList, notifications as initialNotifications } from '../data/mockData';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [cases, setCases] = useState(initialCases);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCases, setSelectedCases] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [filters, setFilters] = useState({
    search: '',
    aging: 'all',
    region: 'all',
    dca: 'all',
    priority: 'all',
    stage: 'all',
    slaStatus: 'all',
    dispute: 'all'
  });

  const switchRole = useCallback((role) => {
    setCurrentUser(prev => ({ ...prev, role }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      aging: 'all',
      region: 'all',
      dca: 'all',
      priority: 'all',
      stage: 'all',
      slaStatus: 'all',
      dispute: 'all'
    });
  }, []);

  const assignCaseToDCA = useCallback((caseId, dcaId) => {
    const dca = dcaList.find(d => d.dca_id === dcaId);
    setCases(prev => prev.map(c => 
      c.case_id === caseId 
        ? { ...c, assigned_dca: dca?.name || c.assigned_dca, assigned_dca_id: dcaId }
        : c
    ));
  }, []);

  const bulkAssignCases = useCallback((caseIds, dcaId) => {
    const dca = dcaList.find(d => d.dca_id === dcaId);
    setCases(prev => prev.map(c => 
      caseIds.includes(c.case_id)
        ? { ...c, assigned_dca: dca?.name || c.assigned_dca, assigned_dca_id: dcaId }
        : c
    ));
    setSelectedCases([]);
  }, []);

  const updateCaseStage = useCallback((caseId, stage) => {
    setCases(prev => prev.map(c => 
      c.case_id === caseId ? { ...c, stage } : c
    ));
  }, []);

  const addActivity = useCallback((caseId, activity) => {
    setCases(prev => prev.map(c => 
      c.case_id === caseId 
        ? { 
            ...c, 
            activities: [activity, ...c.activities],
            last_activity_at: activity.ts
          } 
        : c
    ));
  }, []);

  const markNotificationRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  const getFilteredCases = useCallback(() => {
    return cases.filter(c => {
      if (filters.search && !c.case_id.toLowerCase().includes(filters.search.toLowerCase()) &&
          !c.customer.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.aging !== 'all') {
        const [min, max] = filters.aging.split('-').map(Number);
        if (max && (c.aging_days < min || c.aging_days > max)) return false;
        if (!max && c.aging_days < min) return false;
      }
      if (filters.region !== 'all' && c.customer.region !== filters.region) return false;
      if (filters.dca !== 'all' && c.assigned_dca_id !== filters.dca) return false;
      if (filters.priority !== 'all' && c.priority !== filters.priority) return false;
      if (filters.stage !== 'all' && c.stage !== filters.stage) return false;
      if (filters.slaStatus !== 'all') {
        const now = new Date();
        const deadline = new Date(c.sla_deadline);
        const hoursLeft = (deadline - now) / (1000 * 60 * 60);
        if (filters.slaStatus === 'breached' && hoursLeft >= 0) return false;
        if (filters.slaStatus === 'warning' && (hoursLeft < 0 || hoursLeft > 48)) return false;
        if (filters.slaStatus === 'ok' && hoursLeft <= 48) return false;
      }
      if (filters.dispute !== 'all') {
        if (filters.dispute === 'yes' && !c.dispute_flag) return false;
        if (filters.dispute === 'no' && c.dispute_flag) return false;
      }
      return true;
    });
  }, [cases, filters]);

  const value = {
    currentUser,
    switchRole,
    cases,
    setCases,
    notifications,
    markNotificationRead,
    sidebarCollapsed,
    toggleSidebar,
    selectedCases,
    setSelectedCases,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    resetFilters,
    assignCaseToDCA,
    bulkAssignCases,
    updateCaseStage,
    addActivity,
    getFilteredCases,
    dcaList
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
