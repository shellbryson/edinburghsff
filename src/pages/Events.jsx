import React, { useEffect, useState } from 'react';

import { getDocs, collection, query, orderBy, limit  } from 'firebase/firestore';
import { db } from "../firebase";

import { useHead } from 'hoofd';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Custom Components
import PageHeading from '../components/PageHeading';
import EventsGrid from '../components/EventsGrid';

export default function Events() {

  const [events, setEvents] = useState([])

  useHead({
    title: "Events - Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "Events for writers and readers" }],
  });

  useEffect(() => {
    getEvents();
  }, [])

  const getEvents = async () => {
    const q = query(collection(db, "events"), orderBy("eventStart", "desc"));
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
        <Typography variant="p" component="p" gutterBottom align='center'>
          Events for writers and readers
        </Typography>
      </Container>
      <EventsGrid data={events} />
    </>
  )
}

