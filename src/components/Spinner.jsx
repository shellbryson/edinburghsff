import React from 'react';

// MUI Components
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Spinner() {
  const theme = useTheme();

  const style = {
    container : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: "100%",
      minHeight: "100%",
    },
    spinner : {
      color: theme.palette.brand.main,
    }
  }

  return (
    <Box style={style.container}>
      <CircularProgress style={style.spinner}/>
    </Box>
  );
};