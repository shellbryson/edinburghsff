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
      lineHeight: "1.6",
    },
    '& a' : {
      color: theme.palette.brand.main,
      transition: "textDecoration 250ms",
      textDecoration: `underline ${theme.palette.brand.link} dashed`,
    },
    '& ul': {
      listStyle: "none",
      paddingLeft: "1rem"
    },
    '& ul li::before' : {
      content: "''",
      backgroundColor: theme.palette.brand.faint,
      fontWeight: "bold",
      display: "inline-block",
      width: "4px",
      height: "4px",
      marginLeft: "-26px",
      marginRight: "18px",
      border: `2px solid ${theme.palette.brand.main}`,
    },
    '& li' : {
      lineHeight: "1.6",
      paddingLeft: "12px",
      marginBottom: "0.5rem",
    },
    '& ul + h2' : {
      marginTop: "2rem",
    },
    '& h1' : {
      textAlign: "center",
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      marginTop: "0",
      marginBottom: "1rem",
    },
    '& h2' : {
      display: "inline-block",
      textTransform: 'uppercase',
      padding: '6px 1rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      backgroundColor: theme.palette.highlight.main,
      marginTop: "0",
      marginBottom: "1rem",
      lineHeight: "1.1",
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
    '& code': {
      display: "inline-block",
      border: theme.palette.highlight.main,
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
