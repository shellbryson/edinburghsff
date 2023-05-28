import React, { useEffect, useState } from 'react';

import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

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
  padding: 0
}

const styleEventDate={
  padding: 0
}

const EventsList = ({ data }) => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    setEvents(data);
  }, [data]);

  const eventDate = (eventStartDate) => {
    const d = dayjs(eventStartDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY')
    return <Typography component="p" style={styleEventDate}>{d}</Typography>;
  }

  const fetchEvent = async (id) => {
    if (!id) return;

    console.log("ESFF: fetching Event", id)

    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);

    setSelectedEvent(docSnap.data());
  }

  const handleOpenEvent = (id) => {
    fetchEvent(id);
    setIsOpen(true);
  };

  const handleCloseEvent = () => {
    setIsOpen(false);
  };

  return (
    <>
      <EventDetails isOpen={isOpen} selectedEvent={selectedEvent} onCloseCallback={handleCloseEvent} />
      <Box style={styleGrid} className="grid">
        {events.map((data, index) => (
          <Box style={styleGridCell} key={index} onClick={() => handleOpenEvent(data.id) }>
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
          </Box>
        ))}
      </Box>
    </>
  );
};

export default EventsList;