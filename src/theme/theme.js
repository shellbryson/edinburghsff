import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-body)',
    color: '#ffffff',
    h1: {
      fontSize: 24,
      paddingBottom: '2rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
    },
    h2: {
      fontSize: 18,
      paddingBottom: '1.2rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
    },
    h3: {
      fontSize: 16,
      paddingBottom: '1.2rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
    },
    h4: {
      fontSize: 16,
      paddingBottom: '1.2rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
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
      padding: 0,
    },
    p_tiny: {
      fontSize: 12,
    },
    p_small: {
      fontSize: 13,
    },
    h_small: {
      position: 'relative',
      textTransform: 'uppercase',
      fontSize: 13,
      fontWeight: 'bold',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
    },
    h_medium: {
      fontSize: 22,
      textTransform: 'uppercase',
      paddingBottom: '1.5rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
    },
    h_large: {
      fontSize: 32,
      textTransform: 'uppercase',
      paddingBottom: '2rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
    },
    h_small_lined: {
      position: 'relative',
      textTransform: 'uppercase',
      fontSize: 13,
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      fontStyle: "normal",
      borderTop: '1px solid currentColor',
      paddingTop: "4px",
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: '4px',
        height: '4px',
        backgroundColor: 'currentColor',
        right: "0",
        top: "0",
      },
    },
  },
  palette: {
    mode: 'light',
    text: {
      main: '#f2f2f2',
      dark: '#6d6710',
      contrastText: '#000',
    },
    brand: {
      faint: '#1b1a01',
      link: '#7b7300',
      main: '#fded07',
      dark: '#6d6710',
      contrastText: '#000',
    },
    primary: {
      main: '#262626',
      dark: '#000',
      light: '#3c3c3c',
    },
    secondary: {
      main: '#05d7f2',
    },
    warning: {
      main: '#c51d1d'
    },
    highlight: {
      main: '#27260d'
    },
    form: {
      main: '#262626',
      light: '#3c3c3c',
      dark: '#000',
      contrastText: '#f2f2f2',
    },
    pinVenue: {
      main: '#c184f8'
    },
    pinCafe: {
      main: '#62bae3'
    },
    pinLibrary: {
      main: '#8cd672'
    },
    pinBookshop: {
      main: '#d69372'
    },
    pinInteresting: {
      main: '#fff'
    },
    pinDefault: {
      main: '#fff'
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
