import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CowList from './pages/cows/CowList';
import CowDetailEnhanced from './pages/cows/CowDetailEnhanced';
import BreedingManagement from './pages/breeding/BreedingManagement';
import HealthManagement from './pages/health/HealthManagement';
import FinancialManagement from './pages/financial/FinancialManagement';
import FeedManagement from './pages/feed/FeedManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/cows" element={<CowList />} />
                    <Route path="/cows/:id" element={<CowDetailEnhanced />} />
                    <Route path="/breeding" element={<BreedingManagement />} />
                    <Route path="/health" element={<HealthManagement />} />
                    <Route path="/financial" element={<FinancialManagement />} />
                    <Route path="/feed" element={<FeedManagement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
