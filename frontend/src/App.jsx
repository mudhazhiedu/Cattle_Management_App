import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/common/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import CowList from './pages/cows/CowList';
import CowDetail from './pages/cows/CowDetail';
import BreedingManagement from './pages/breeding/BreedingManagement';

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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cows" element={<CowList />} />
            <Route path="/cows/:id" element={<CowDetail />} />
            <Route path="/breeding" element={<BreedingManagement />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
