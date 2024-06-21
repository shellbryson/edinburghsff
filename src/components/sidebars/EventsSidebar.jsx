import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI Components
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EventsPanel from '../panels/EventsPanel';
import EventsCalendarPanel from '../panels/EventsCalendarPanel';

const SidebarBox = styled(Box)(({ theme }) => ({
  //background: theme.palette.brand.main,
  marginBottom: "2rem",
  cursor: "pointer",
  width: "300px"
}));

export default function EventsSidebar({events, onClickDate}) {

  return (
    <SidebarBox>
      <EventsPanel showAction={false} />
      <EventsCalendarPanel events={events} onClickDate={onClickDate}/>
    </SidebarBox>
  );
};