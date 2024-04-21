import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-body)',
    color: '#ffffff',
    h1: {
      fontSize: 24,
      paddingBottom: '2rem'
    },
    h2: {
      fontSize: 18,
      paddingBottom: '1.5rem'
    },
    tile_heading: {
      fontSize: 24,
    },
    a_white: {
      fontSize: 16,
      color: '#ffffff',
    },
    p: {
      fontSize: 16,
    },
    p_small: {
      fontSize: 13,
    },
    h_small: {
      position: 'relative',
      textTransform: 'uppercase',
      fontSize: 13,
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
    h_medium: {
      fontSize: 18,
      textTransform: 'uppercase',
      paddingBottom: '1.5rem'
    },
    h_large: {
      fontSize: 24,
      textTransform: 'uppercase',
      paddingBottom: '2rem'
    },
  },
  palette: {
    mode: 'light',
    brand: {
      main: '#fded07',
    },
    primary: {
      main: '#fded07',
      dark: '#6d6710',
    },
    secondary: {
      main: '#05d7f2',
    },
    warning: {
      main: '#c51d1d'
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

