import React, { useEffect, useState } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";
import { useHead } from 'hoofd';
import ReactMarkdown from 'react-markdown';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';

// Custom Components
import PageHeading from '../components/PageHeading';
import EventsGrid from '../components/EventsGrid';
import LinkInterceptor from '../components/LinkInterceptor';
import EventsSidebar from '../components/sidebars/EventsSidebar';
import Loader from '../components/Loader';

const PageBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0 1rem",
  color: theme.palette.text.main
}));

const SidebarBox = styled(Box)(({ theme, wide }) => ({
  padding: "0 1rem",
  color: theme.palette.text.main
}));

export default function Events() {

  const { config } = useApp();
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('md'));

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sidebarWidth = "33%";

  const style = {
    paper: {
      display: "flex",
      position: "relative",
      flexDirection: wide ? "row" : "column",
      overflow: "hidden",
      gap: "1rem"
    },
    content: {
      textAlign: "left",
      overflow: "auto",
      width: wide ? `calc(66% - 3rem)` : "100%",
    },
    sidebar: {
      top: "2rem",
      right: "3rem",
      position: wide ? "fixed" : "relative",
      width: wide ? sidebarWidth : "100%",
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
    setIsLoading(true);
    const q = query(collection(db, "events"), orderBy("eventStart", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setIsLoading(false);
    setEvents(l);
  }

  const onClickDate = (date) => {
    console.log("Date clicked", date);
  }

  return (
    <PageBox className="sff-page">
      <Box style={style.paper}>
        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <Box style={style.content} className="scroll-dialog">
              <PageHeading heading="Events" />
              <ContentBox>
                <LinkInterceptor>
                  <ReactMarkdown children={config.textEventIntro} />
                </LinkInterceptor>
              </ContentBox>
              <EventsGrid data={events} />
              {!wide && <EventsSidebar events={events} onClickDate={onClickDate}/> }
            </Box>
            {wide && <SidebarBox style={style.sidebar}>
              <EventsSidebar events={events} onClickDate={onClickDate}/>
            </SidebarBox>
            }
          </>
        )}
      </Box>
    </PageBox>
  )
}

