import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B8B', // 부드러운 핑크
      light: '#FFB6C1',
      dark: '#DB7093',
    },
    secondary: {
      main: '#9B59B6', // 부드러운 퍼플
      light: '#BB8FCE',
      dark: '#8E44AD',
    },
    background: {
      default: '#FFF5F7', // 매우 연한 핑크
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50', // 진한 회색
      secondary: '#7F8C8D', // 중간 회색
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#2C3E50',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#2C3E50',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#2C3E50',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#2C3E50',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2C3E50',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#2C3E50',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#2C3E50',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#7F8C8D',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          background: 'linear-gradient(45deg, #FF6B8B 30%, #FFB6C1 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme; 