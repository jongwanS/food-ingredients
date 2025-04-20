import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BrandDetail from './pages/BrandDetail';
import MenuDetail from './pages/MenuDetail';
import SearchResults from './pages/SearchResults';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          background: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar />
          <Box component="main" sx={{ 
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: '1200px',
            width: '100%',
            mx: 'auto'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/brand/:id" element={<BrandDetail />} />
              <Route path="/menu/:id" element={<MenuDetail />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
