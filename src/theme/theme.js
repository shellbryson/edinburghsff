import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-body)',
    color: '#003B4A',
    h1: {
      fontSize: 32,
      textTransform: 'uppercase',
      paddingBottom: '2rem'
    },
    h2: {
      fontSize: 18,
      textTransform: 'uppercase',
      paddingBottom: '1.5rem'
    },
    p: {
      fontSize: 16,
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#007896',
    },
    primary_dark: {
      main: '#003B4A',
    },
    secondary: {
      main: '#EEF0EE',
    },
    warning: {
      main: '#FDE6D8'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-body)'
        },
        sizeSmall: {
          fontSize: '0.8rem',
          padding: '3px 1rem',
        }
      },
    }
  }
});

