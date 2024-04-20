import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { getDocs, collection, query, orderBy, limit  } from 'firebase/firestore';
import { db } from "../../firebase";

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import EventIcon from '@mui/icons-material/Event';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// Custom UI
import EventDetails from '../EventDetails';

export default function UpComingEvents() {

  const theme = useTheme();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  const styleEvents={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
    border: `1px solid ${theme.palette.primary.main}`,
    padding: "0.5rem"
  }

  const styleEvent={
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  }

  const styleMore={
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  }

  useEffect(() => {
    getEvents();
  }, [])

  const getEvents = async () => {
    const q = query(collection(db, "events"), orderBy("eventStart", "desc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    const today = dayjs();

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      const c = doc.data();
      const start = dayjs(c.eventStart.toDate());
      const end = dayjs(c.eventEnd.toDate());
      if (!start || !end) return;
      if (start.isAfter(today) || start.isSame(today)) {
        l.push({
          ...doc.data(),
          id: doc.id
        });
      }
    });
    setEvents(l);
  }

  const handleClickEvent = (id) => {
    console.log("Event Clicked", id);
  }

  const handleClickExpand = () => {
    navigate("/events");
  }

  const handleCloseEvent = () => {
    setIsOpen(false);
    setSelectedEvent({});
  };

  return (
    <Box style={styleEvents} className="sff-interesting">
      <Typeography component="p" variant="title_small">Events</Typeography>
      {events.map((event, index) => (
        <Box key={index} style={styleEvent} className="sff-interesting__place">
          <Typeography component="p" key={index} onClick={() => handleClickEvent(event.id)}>{event.title}</Typeography>
          <EventIcon />
        </Box>
      ))}
      <Box style={styleMore} className="sff-interesting__place">
        <Typeography component="p" onClick={() => handleClickExpand()}>Expand events</Typeography>
        <ChevronRightIcon />
      </Box>
      <EventDetails isOpen={isOpen} isLoadingEvent={isLoadingEvent} selectedEvent={selectedEvent} onCloseCallback={handleCloseEvent} />
    </Box>
  );
}
