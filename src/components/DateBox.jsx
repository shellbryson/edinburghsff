import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Icons
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function DateBox({event}) {

  const theme = useTheme();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);

  const MetaBox = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: "0.25rem",
    gap: "1px",
    alignItems: "center",
    border: `1px solid ${theme.palette.brand.main}`,
    backgroundColor: "#000",
    justifyContent: "center",
    color: theme.palette.brand.main,
    maxWidth: "280px",
    fontFamily: '"Chakra Petch", sans-serif',
    "& > div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      whiteSpace: "nowrap",
    }
  }));

  const DisplayBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "0.25rem 0.5rem",
    gap: "0.25rem",
    fontSize: "0.75rem",
    backgroundColor: theme.palette.brand.main,
    color: theme.palette.text.contrastText,
    width: "100%",
  }));

  useEffect(() => {
    if (event.title) {
      setIsAllDay(event.eventIsAllDay);
      setStartDate(dayjs(event.eventStart.toDate()).format('DD/MM/YYYY'));
      setEndDate(dayjs(event.eventEnd.toDate()).format('DD/MM/YYYY'));
      setStartTime(dayjs(event.eventStart.toDate()).format('HH:mm'));
      setEndTime(dayjs(event.eventEnd.toDate()).format('HH:mm'));
    }
  }, [event?.id]);

  return (
    <MetaBox>
      {!isAllDay && (
        <>
          <DisplayBox>
            <EventIcon /> {startDate}
          </DisplayBox>
          <DisplayBox>
            <AccessTimeIcon /> {startTime}-{endTime}
          </DisplayBox>
        </>
      )}
      {isAllDay && (
        <>
          <DisplayBox>
            <EventIcon /> {startDate}
          </DisplayBox>
          <Box style={{marginLeft: "2px", marginRight: "2px"}}>to</Box>
          <DisplayBox>
            <EventIcon /> {endDate}
          </DisplayBox>
        </>
      )}
    </MetaBox>
  );
}
