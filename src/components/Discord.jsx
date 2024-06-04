import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI Components
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Assets
import Masthead from '../assets/DiscordMastheadPanel.png';

const DiscordBox = styled(Box)(({ theme }) => ({
  background: theme.palette.brand.main,
  marginBottom: "2rem",
  cursor: "pointer",
}));

const LinkBox = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  gap: "0.5rem",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.brand.main,
  color: theme.palette.brand.contrastText,
  padding: "0.5rem",
}));

export default function Discord() {

  const navigate = useNavigate();
  const theme = useTheme();

  const handleOnClick = () => {
    navigate(`/community`);
  }

  return (
    <DiscordBox onClick={()=>handleOnClick()}>
      <Box style={{display: "flex", justifyContent: "center", borderTop: `2px solid ${theme.palette.brand.main}`}}>
        <img src={Masthead} alt="Discord Masthead" style={{width: "100%", height: "auto" }} />
      </Box>
      <LinkBox>
        <Typography style={{ color: "black"}}>ESFF Writers Discord</Typography>
        <ArrowForwardIcon style={{ color: "black"}} />
      </LinkBox>
    </DiscordBox>
  );
};