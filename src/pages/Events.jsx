import React, { useEffect, useState } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";
import { useHead } from 'hoofd';
import ReactMarkdown from 'react-markdown';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Custom Components
import PageHeading from '../components/PageHeading';
import EventsGrid from '../components/EventsGrid';
import LinkInterceptor from '../components/LinkInterceptor';

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0 1rem",
  color: theme.palette.text.main
}));

export default function Events() {

  const { config } = useApp();
  const theme = useTheme();
  const [events, setEvents] = useState([]);

  const style = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    content: {
      textAlign: "left",
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
    const q = query(collection(db, "events"), orderBy("eventStart", "asc"));
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
        <Box style={style.content} className="scroll-dialog">
          <PageHeading heading="Events" />
          <ContentBox>
            <LinkInterceptor>
              <ReactMarkdown children={config.textEventIntro} />
            </LinkInterceptor>
          </ContentBox>
          <EventsGrid data={events} />
        </Box>
      </Box>
    </Box>
  )
}

