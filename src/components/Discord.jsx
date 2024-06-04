import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI Components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

// Assets
import DiscordIcon from '../assets/discord.svg';

const DiscordBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  margin: "2rem 0",
  cursor: "pointer",
  textAlign: "center",
  alignItems: "center",
}));

export default function Discord() {

  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(`/community`);
  }

  return (
    <DiscordBox onClick={()=>handleOnClick()}>
      <img src={DiscordIcon} alt="Discord" style={{display: "block", width: "24px", height: "24px"}} />
      <Typography>ESFF Discord</Typography>
    </DiscordBox>
  );
};