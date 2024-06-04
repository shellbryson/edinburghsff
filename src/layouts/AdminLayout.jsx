import React from 'react';

// MUI Components
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Container';

const style={
  page: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  },
  content: {
    position: "relative",
    textAlign: "left",
    paddingRight: "1rem",
    paddingLeft: "0.5rem",
    marginBottom: "1rem",
    marginTop: "1rem",
    overflow: "auto",
  }
}

export default function AdminLayout({children}) {
  const theme = useTheme();

  return (
    <Box style={style.page} className="sff-page">
      <Box style={style.content} className="scroll-dialog-admin">
        {children}
      </Box>
    </Box>
  )
}