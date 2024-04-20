import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { slugify } from '../utils/utils';

import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

// Custom UI
import EventsGridImage from './EventsGridImage';
import EventDetails from './modals/EventDetails';

const styleEventsSection={
  marginTop: "3rem",
  position: "relative",
}

const styleGrid={
  display: "grid",
  position: "relative",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "4px",
  marginBottom: "2rem",
  zIndex: 1,
}

const EventsGrid = ({ data }) => {
  const [eventsCurrent, setEventsCurrent] = useState([]);
  const [eventsFuture, setEventsFuture] = useState([]);
  const [eventsPast, setEventsPast] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const navigate = useNavigate();
  const params = useParams();

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

  const renderEventDate = (eventStartDate, eventEndDate, eventIsAllDay) => {
    let displayDate = "";
    if (eventIsAllDay) {
      const _startDate = dayjs(eventStartDate.toDate(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY');
      const _endDate = dayjs(eventEndDate.toDate(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY');
      displayDate = _startDate === _endDate ? _startDate : `${_startDate} to ${_endDate}`;
    } else {
      const _startDate = dayjs(eventStartDate.toDate(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY, HH:mm');
      const _endDate = dayjs(eventEndDate.toDate(), 'DD/MM/YYYY, HH:mm:ss').format('HH:mm');
      displayDate = `${_startDate} to ${_endDate}`;
    }
    return <Box className="sff-events-grid__event-date"><Typography component="p">{displayDate}</Typography></Box>;
  }

  const renderSubGrid = (heading, arrayOfEvents) => {
    if (arrayOfEvents.length === 0) return;

    return(
      <Box style={styleEventsSection} className="sff-events-section">
        <Typography variant="h2" component="h2" sx={{ marginLeft: "1rem", textAlign: "center"}}>{heading}</Typography>
        <Box style={styleGrid} className="sff-events-grid">
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
                { renderEventDate(data?.eventStart, data?.eventEnd, data?.eventIsAllDay) }
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    )
  }

  const fetchEvent = async (id) => {
    if (!id) return;

    console.log("ESFF: fetching Event", id)

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
      <Container maxWidth="md" disableGutters>
        {renderSubGrid("Future events", eventsFuture)}
        {renderSubGrid("Current events", eventsCurrent)}
        {renderSubGrid("Past events", eventsPast)}
      </Container>
    </>
  );
};

export default EventsGrid;