import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

// Custom UI
import EventsGridImage from './EventsGridImage';
import EventDetails from './EventDetails';
import { set } from 'react-hook-form';

const styleGrid={
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "4px",
  marginTop: "2rem"
}

const styleGridCell={
  display: "block",
  position: "relative",
  aspect: "1/1",
  cursor: "pointer",
}

const styleGridContent={
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  aspect: "1/1",
  zIndex: 2,
  inset: "1rem",
  textAlign: "left",
  color: "#fff",
  height: "calc(100% - 2rem)",
}

const styleEventTitle={
  padding: 0
}

const styleEventDate={
  padding: 0,
  marginTop: "auto",
}

const EventsGrid = ({ data }) => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setEvents(data);

    if (params?.eventID) {
      setIsLoadingEvent(true);
      fetchEvent(params.eventID);
      setIsOpen(true);
    }
  }, [data, params?.eventID]);

  const eventDate = (eventStartDate, eventEndDate, eventIsAllDay) => {
    let displayDate = "";

    if (eventIsAllDay) {
      const _startDate = dayjs(eventStartDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY');
      const _endDate = dayjs(eventEndDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY');
      displayDate = _startDate === _endDate ? _startDate : `${_startDate} to ${_endDate}`;
    } else {
      const _startDate = dayjs(eventStartDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY, HH:mm');
      const _endDate = dayjs(eventEndDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('HH:mm');
      displayDate = `${_startDate} to ${_endDate}`;
    }

    return <Typography component="p" style={styleEventDate}>{displayDate}</Typography>;
  }

  const slugify = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
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
      <Box style={styleGrid} className="sff-events-grid">
        {events.map((data, index) => (
          <Link className="sff-events-grid__event" style={styleGridCell} key={index} href={`/events/${data.id}/${slugify(data.title)}`} onClick={(e) => {handleOpenEvent(e, data.id, data.title)}}>
            <EventsGridImage image={data?.image} alt={data?.title} />
            <Box style={styleGridContent}>
              <Stack spacing={2}>
                <Typography variant='tile_heading' style={styleEventTitle}>
                  {data.title}
                </Typography>
                <Typography variant="p">
                  {data.descriptionShort}
                </Typography>
              </Stack>
              { eventDate(data?.eventStart, data?.eventEnd, data?.eventIsAllDay) }
            </Box>
          </Link>
        ))}
      </Box>
    </>
  );
};

export default EventsGrid;