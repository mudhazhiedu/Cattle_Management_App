import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Dashboard as DashboardIcon, Pets as PetsIcon, FavoriteBorder as BreedingIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <Button
            color="inherit"
            startIcon={<BreedingIcon />}
            onClick={() => navigate('/breeding')}
            sx={{ fontWeight: location.pathname === '/breeding' ? 'bold' : 'normal' }}
          >
            Breeding
          </Button>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {user?.fullName} ({user?.role})
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
