import React from 'react';

// MUI Components
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 2,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#000",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.brand.main,
  },
}));

export default function Loader() {

  return (
    <BorderLinearProgress />
  );
};