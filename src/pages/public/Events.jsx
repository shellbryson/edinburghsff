import React, { useEffect, useState } from 'react';

import { getDocs, collection, query, orderBy, limit  } from 'firebase/firestore';
import { db } from "../../firebase";

import { useHead } from 'hoofd';

// MUI
import Box from '@mui/material/Box';

// Custom Components
import PageHeading from '../../components/PageHeading';
import EventsGrid from '../../components/EventsGrid';

export default function Events() {

  const [events, setEvents] = useState([]);

  const style = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      marginBottom: "1rem",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    content: {
      textAlign: "left",
      margin: "0.5rem",
      overflow: "auto",
    }
  }

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
    <Box style={style.page} className="sff-page">
      <Box style={style.paper}>
        <Box style={style.content}>
          <PageHeading heading="Events" />
          <EventsGrid data={events} />
        </Box>
      </Box>
    </Box>
  )
}

