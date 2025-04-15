import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5c6bc0',
      light: '#8e99f3',
      dark: '#26418f',
      contrastText: '#fff',
    },
    background: {
      default: '#e8eaf6',
      paper: '#ffffff',
      gradient: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
    },
    gradient: {
      primary: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
      secondary: 'linear-gradient(45deg, #5c6bc0 30%, #8e99f3 90%)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #002984 30%, #3f51b5 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(63, 81, 181, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(63, 81, 181, 0.12)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0 8px',
          width: 'calc(100% - 16px)',
          '&:hover': {
            backgroundColor: 'rgba(63, 81, 181, 0.08)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '8px 0',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
});

export default theme;
