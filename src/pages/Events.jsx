import React, { useEffect, useState } from 'react';

import { getDocs, collection, query, orderBy, limit  } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Container from '@mui/material/Container';

// Custom Components
import PageHeading from '../components/PageHeading';
import EventsGrid from '../components/EventsGrid';

export default function AdminLinks() {

  const [events, setEvents] = useState([])

  useEffect(() => {
    getEvents();
  }, [])

  const q = query(collection(db, "events"), orderBy("eventStart", "desc"));

  const getEvents = async () => {
    const querySnapshot = await getDocs(q);
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
    <>
      <Container>
        <PageHeading heading="Events" />
      </Container>
      <EventsGrid data={events} />
    </>
  )
}

