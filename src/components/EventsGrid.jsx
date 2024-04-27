import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import { slugify } from '../utils/utils';

// Custom UI
import EventsGridImage from './EventsGridImage';
import EventDetails from './modals/EventDetails';

const EventsGrid = ({ data }) => {
  const [eventsCurrent, setEventsCurrent] = useState([]);
  const [eventsFuture, setEventsFuture] = useState([]);
  const [eventsPast, setEventsPast] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  const style={
    section:{
      position: "relative",
    },
    grid: {
      display: "grid",
      position: "relative",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "4px",
      marginBottom: "2rem",
      zIndex: 1,
    }
  }

  useEffect(() => {
    splitEvents(data);

    if (params?.eventID) {
      setIsLoadingEvent(true);
      fetchEvent(params.eventID);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [data, params?.eventID]);

  const splitEvents = (events) => {
    if (!events) return;

    const today = dayjs();
    const eCurrent = [];
    const eFuture = [];
    const ePast = [];

    events.forEach((event) => {
      const start = dayjs(event.eventStart.toDate());
      const end = dayjs(event.eventEnd.toDate());

      if (end.isBefore(today)) {
        ePast.push(event);
      } else if (start.isAfter(today)) {
        eFuture.push(event);
      } else {
        eCurrent.push(event);
      }
    });

    setEventsCurrent(eCurrent);
    setEventsPast(ePast);
    setEventsFuture(eFuture);
  }

  const renderEventDate = (currentEvent) => {
    if (!currentEvent.eventStart || !currentEvent.eventEnd) return;
    let displayDate = "";
    if (currentEvent.eventIsAllDay) {
      const _startDate = dayjs(currentEvent.eventStart.toDate()).format('DD/MM/YYYY');
      const _endDate = dayjs(currentEvent.eventEnd.toDate()).format('DD/MM/YYYY');
      displayDate = _startDate === _endDate ? _startDate : `${_startDate} to ${_endDate}`;
    } else {
      const _startDate = dayjs(currentEvent.eventStart.toDate()).format('DD/MM/YYYY, HH:mm');
      const _endDate = dayjs(currentEvent.eventEnd.toDate()).format('HH:mm');
      displayDate = `${_startDate} to ${_endDate}`;
    }
    return <Box className="sff-events-grid__event-date"><Typography component="p">{displayDate}</Typography></Box>;
  }

  const renderSubGrid = (heading, arrayOfEvents) => {
    if (arrayOfEvents.length === 0) return;

    return(
      <Box style={style.section} className="sff-events-section">
        <Typography variant="h2" component="h2" color={theme.palette.primary.contrastText} sx={{ marginLeft: "1rem", textAlign: "center"}}>{heading}</Typography>
        <Box style={style.grid} className="sff-events-grid">
          {arrayOfEvents.map((data, index) => (
            <Link className="sff-events-grid__event" key={index} href={`/events/${data.id}/${slugify(data.title)}`} onClick={(e) => {handleOpenEvent(e, data.id, data.title)}}>
              <EventsGridImage image={data?.image} alt={data?.title} />
              <Box className="sff-events-grid__event-content">
                <Stack spacing={2}>
                  <Typography variant='tile_heading' className='sff-events-grid__event-title'>
                    {data.title}
                  </Typography>
                  <Typography variant="p">
                    {data.descriptionShort}
                  </Typography>
                </Stack>
                { renderEventDate(data) }
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    )
  }

  const fetchEvent = async (id) => {
    if (!id) return;
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    setIsLoadingEvent(false);
    setSelectedEvent(docSnap.data());
  }

  const handleOpenEvent = (e, id, title) => {
    e && e.preventDefault();
    navigate(`/events/${id}/${slugify(title)}`);
    setIsLoadingEvent(true);
    fetchEvent(id);
    setIsOpen(true);
  };

  const handleCloseEvent = () => {
    navigate(`/events`);
    setIsOpen(false);
    setSelectedEvent({});
  };

  return (
    <>
      <EventDetails isOpen={isOpen} isLoadingEvent={isLoadingEvent} selectedEvent={selectedEvent} onCloseCallback={handleCloseEvent} />
      <Box>
        {renderSubGrid("Future events", eventsFuture)}
        {renderSubGrid("Current events", eventsCurrent)}
        {renderSubGrid("Past events", eventsPast)}
      </Box>
    </>
  );
};

export default EventsGrid;