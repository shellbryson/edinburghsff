import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI Components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Assets
import Masthead from '../assets/DiscordMasthead.png';

const DiscordBox = styled(Box)(({ theme }) => ({
  background: theme.palette.brand.main,
  marginBottom: "2rem",
}));

const LinkBox = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  gap: "0.5rem",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.brand.main,
  color: theme.palette.brand.contrastText,
  padding: "0.5rem",
  width: "100%",
}));

export default function Discord() {

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/community`);
  }

  return (
    <DiscordBox onClick={()=>handleOnClick()}>
      <Box style={{display: "flex", justifyContent: "center"}}>
        <img src={Masthead} alt="Discord Masthead" style={{width: "100%", height: "auto" }} />
      </Box>
      <LinkBox>
        <Typography style={{ color: "black"}}>ESFF Discord</Typography>
        <ArrowForwardIcon style={{ color: "black"}} />
      </LinkBox>
    </DiscordBox>
  );
};