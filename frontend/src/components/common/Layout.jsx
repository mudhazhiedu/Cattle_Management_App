import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Dashboard as DashboardIcon, Pets as PetsIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cattle Management System
          </Typography>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/')}
            sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<PetsIcon />}
            onClick={() => navigate('/cows')}
            sx={{ fontWeight: location.pathname === '/cows' ? 'bold' : 'normal' }}
          >
            Cows
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
