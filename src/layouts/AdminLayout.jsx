import React from 'react';

// MUI Components
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Container';

export default function AdminLayout({children}) {
  const theme = useTheme();

  const style={
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      marginBottom: "1rem",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
    },
    content: {
      textAlign: "left",
      paddingRight: "1rem",
      paddingLeft: "0.5rem",
      marginTop: "1rem",
      marginBottom: "1rem",
      marginTop: "1rem",
      overflow: "auto",
    }
  }

  return (
    <Box style={style.page} className="sff-page">
      <Box style={style.content} className="scroll-dialog-admin">
        {children}
      </Box>
    </Box>
  )
}