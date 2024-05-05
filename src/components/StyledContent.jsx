import React from 'react';

// MUI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function StyledContent({ children}) {

  const Page = styled(Box)(({ theme }) => ({
    background: theme.palette.brand.faint,
    color: theme.palette.text.main,
    '& p h2, p + h2, p + h3, p + h4' : {
      marginTop: "2rem",
    },
    '& p' : {
      marginBottom: "1rem",
      padding: 0,
    },
    '& a' : {
      color: theme.palette.brand.main,
      textDecoration: "underline",
    },
    '& h1' : {
      textAlign: "center",
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      marginTop: "0",
      marginBottom: "1rem",
    },
    '& h2, h3' : {
      display: "inline-block",
      textTransform: 'uppercase',
      padding: '6px 1rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      backgroundColor: "rgba(255,255,255,.05)",
      marginTop: "0",
      marginBottom: "1rem",
    },
    '& h2::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      right: "0",
      top: "0",
    },
    '& h2 + div + ul': {
      marginTop: "2rem",
      border: "1px solid red"
    },
    '& code': {
      display: "inline-block",
      border: "1px solid rgba(255,255,255,.05)",
      padding: "4px 8px",
      marginBottom: "2px",
      color: theme.palette.brand.dark,
      fontWeight: "var(--font-body-bold-weight)"
    },
  }));

  return (
    <Page elevation={0} className="sff-styled-content">
      { children }
    </Page>
  );
}
