import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CowList from './pages/cows/CowList';

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
      <CowList />
    </ThemeProvider>
  );
}

export default App;
