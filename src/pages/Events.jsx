import React, { useEffect, useState } from 'react';

import { getDocs, collection } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// Custom Components
import EventsGrid from '../components/EventsGrid';

export default function AdminLinks() {

  const [events, setEvents] = useState([])

  useEffect(() => {
    getEvents();
  }, [])

  const getEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setEvents(l);
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Events
      </Typography>
      <EventsGrid data={events} enableAdminActions={false} />
    </Container>
  )
}

