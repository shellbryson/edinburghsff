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
  marginBottom: "2rem",
}));


export default function EventsSidebar({events, onClickDate}) {

  console.log('EventsSidebar', events);

  return (
    <SidebarBox>
      <EventsPanel showAction={false} />
      <EventsCalendarPanel events={events} onClickDate={onClickDate}/>
    </SidebarBox>
  );
};