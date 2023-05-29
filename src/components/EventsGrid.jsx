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

const styleGrid={
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0",
  marginTop: "2rem"
}

const styleGridCell={
  display: "block",
  position: "relative",
  aspect: "1/1",
  cursor: "pointer",
}

const styleGridContent={
  display: "block",
  position: "absolute",
  aspect: "1/1",
  zIndex: 2,
  inset: "1rem",
  textAlign: "left",
  color: "#fff",
}

const styleEventTitle={
  fontSize: "clamp(1rem, -0.875rem + 8.333vw, 3.5rem)",
  padding: 0
}

const styleEventDate={
  padding: 0
}

const EventsList = ({ data }) => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setEvents(data);

    if (params?.eventID) {
      fetchEvent(params.eventID);
      setIsOpen(true);
    }
  }, [data, params?.eventID]);

  const eventDate = (eventStartDate) => {
    const d = dayjs(eventStartDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY')
    return <Typography component="p" style={styleEventDate}>{d}</Typography>;
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

    setSelectedEvent(docSnap.data());
  }

  const handleOpenEvent = (id, title) => {
    navigate(`/events/${id}/${slugify(title)}`);
    fetchEvent(id);
    setIsOpen(true);
  };

  const handleCloseEvent = () => {
    setIsOpen(false);
  };

  return (
    <>
      <EventDetails isOpen={isOpen} selectedEvent={selectedEvent} onCloseCallback={handleCloseEvent} />
      <Box style={styleGrid} className="sff-events-grid">
        {events.map((data, index) => (
          <Link className="sff-events-grid__event" style={styleGridCell} key={index} href={`/events/${data.id}/${slugify(data.title)}`} onClick={() => handleOpenEvent(data.id, data.title) }>
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
              { eventDate(data?.eventStart) }
            </Box>
          </Link>
        ))}
      </Box>
    </>
  );
};

export default EventsList;