import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-body)',
    color: '#ffffff',
    h1: {
      fontSize: 32,
      textTransform: 'uppercase',
      paddingBottom: '2rem'
    },
    h2: {
      fontSize: 24,
      paddingBottom: '1.5rem'
    },
    tile_heading: {
      fontSize: 24,
    },
    p: {
      fontSize: 16,
    },
    p_small: {
      fontSize: 12,
    },
    title_small: {
      position: 'relative',
      textTransform: 'uppercase',
      fontSize: 14,
      fontWeight: 'bold',
      borderBottom: '1px solid currentColor',
      '&::after': {
        content: '""',
        display: 'block',
        width: '4px',
        height: '2px',
        backgroundColor: 'currentColor',
        right: "100%",
        paddingTop: "1px"
      },
    },
  },
  palette: {
    mode: 'light',
    brand: {
      main: '#fded07',
    },
    primary: {
      main: '#fded07',
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
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
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

