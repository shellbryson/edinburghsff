import React, { useEffect, useState } from 'react';

import { getDocs, collection, query, orderBy, limit  } from 'firebase/firestore';
import { db } from "../../firebase";

import { useHead } from 'hoofd';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Custom Components
import PageHeading from '../../components/PageHeading';
import EventsGrid from '../../components/EventsGrid';

export default function Events() {
  const theme = useTheme();
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
        <Box style={style.content} className="scroll">
          <PageHeading heading="Events" />
          <Box style={{ padding: "1rem"}}>
            <Typography style={{color: theme.palette.text.main}}>
              Do you have an event you would like to share? Please get in touch with us.
            </Typography>
          </Box>
          <EventsGrid data={events} />
        </Box>
      </Box>
    </Box>
  )
}

