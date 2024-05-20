import React from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI Components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Icons
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const KofiBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: "2rem 0",
}));

export default function Kofi() {
  const { config } = useApp();
  if (!config.kofi_key) return null;
  return (
    <KofiBox>
      <Button size="small" color="brand" variant="outlined" href={`https://ko-fi.com/${config.kofi_key}`} target='_blank' rel='noopener noreferrer' startIcon={<LocalCafeIcon />}>
        Support us on Ko-fi
      </Button>
    </KofiBox>
  );
};