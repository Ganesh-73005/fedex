import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import CaseDetail from './pages/CaseDetail';
import Allocation from './pages/Allocation';
import DCAPortal from './pages/DCAPortal';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:caseId" element={<CaseDetail />} />
            <Route path="/allocation" element={<Allocation />} />
            <Route path="/dca-portal" element={<DCAPortal />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  );
}

export default App;
