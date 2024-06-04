import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../../firebase";

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';

// Icons
import EventIcon from '@mui/icons-material/Event';

import { slugify } from '../../utils/utils';

export default function EventsPanel() {

  const theme = useTheme();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const EventBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.brand.main,
    color: theme.palette.brand.contrastText,
    padding: "0.5rem",
  }));

  const MoreBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.brand.faint,
    padding: "0.5rem",
  }));

  const EventLink = styled(Typeography)(({ theme }) => ({
    whiteSpace: "nowrap",
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.palette.brand.contrastText,
  }));

  const style = {
    events: {
      display: "flex",
      position: "relative",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "2rem",
    }
  }

  useEffect(() => {
    getEvents();
  }, [])

  const getEvents = async () => {
    const q = query(collection(db, "events"), orderBy("eventStart", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    const today = dayjs();

    querySnapshot.forEach((doc) => {
      const c = doc.data();
      const start = dayjs(c.eventStart.toDate());
      const end = dayjs(c.eventEnd.toDate());
      if (!start || !end) return;
      if (end.isAfter(today) && c.eventIsFeatured) {
        l.push({
          ...doc.data(),
          id: doc.id
        });
      }
    });
    setEvents(l);
  }

  const handleClickExpand = () => {
    navigate("/events");
  }

  const handleClickEvent = (event) => {
    navigate(`/events/${event.id}/${slugify(event.title)}`);
  };

  return (
    <Box style={style.events} className="sff-panel-events">
      <Typeography component="h2" variant="h_small_lined">Events</Typeography>
      {events.map((event, index) => (
        <EventBox key={index} className="sff-panel-events__event">
          <EventLink component="a" onClick={() => handleClickEvent(event)}>{event.title}</EventLink>
          <EventIcon />
        </EventBox>
      ))}
      <MoreBox className="sff-interesting__place" onClick={() => handleClickExpand()}>
        <Typeography>View all</Typeography>
        <EventIcon />
      </MoreBox>
    </Box>
  );
}
