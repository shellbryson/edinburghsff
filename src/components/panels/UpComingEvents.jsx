import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import { getDocs, collection, query, orderBy, limit  } from 'firebase/firestore';
import { db } from "../../firebase";

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Icons
import EventIcon from '@mui/icons-material/Event';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Custom UI
import EventDetails from '../modals/EventDetails';

export default function UpComingEvents() {

  const theme = useTheme();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  const styleEvents={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "2rem",
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

  const styleLink={
    whiteSpace: "nowrap",
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }

  const styleMore={
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "top",
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

  const handleClickExpand = () => {
    navigate("/events");
  }

  const handleClickEvent = (event) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const handleCloseEvent = () => {
    setSelectedEvent({});
    setIsOpen(false);
  }

  return (
    <Box style={styleEvents} className="sff-panel-events">
      <Typeography component="h2" variant="h_small_lined">Events</Typeography>
      {events.map((event, index) => (
        <Box key={index} style={styleEvent} className="sff-panel-events__event">
          <Typeography style={styleLink} component="a" variant="a_white" onClick={() => handleClickEvent(event)}>{event.title}</Typeography>
          <EventIcon />
        </Box>
      ))}
      <Box style={styleMore} className="sff-interesting__place">
        <Typeography component="a" onClick={() => handleClickExpand()}>Expand events</Typeography>
        <ChevronRightIcon />
      </Box>
      <EventDetails
        isOpen={isOpen}
        isLoadingEvent={isLoadingEvent}
        selectedEvent={selectedEvent}
        onCloseCallback={handleCloseEvent} />
    </Box>
  );
}
