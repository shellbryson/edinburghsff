import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { slugify } from '../utils/utils';

// Custom UI
import EventsGridImage from './EventsGridImage';
import DateBox from './DateBox';

const EventBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem",
  margin: "0.5rem",
  backgroundColor: theme.palette.brand.main,
  color: theme.palette.brand.contrastText,
  cursor: "pointer",
}));

const EventContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  color: theme.palette.primary.main,
  padding: "0.25rem",
  width: "100%",
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  margin: "3rem 1rem 0 1rem",
}));

const EventsGrid = ({ data }) => {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();

  const [eventsCurrent, setEventsCurrent] = useState([]);
  const [eventsFuture, setEventsFuture] = useState([]);
  const [eventsPast, setEventsPast] = useState([]);

  useEffect(() => {
    splitEvents(data);

    if (params?.eventID) {
      setIsLoadingEvent(true);
      fetchEvent(params.eventID);
    }
  }, [data, params?.eventID]);

  const splitEvents = (events) => {
    if (!events) return;

    const today = dayjs();
    const eCurrent = [];
    const eFuture = [];
    const ePast = [];

    events.forEach((event) => {
      const start = dayjs(event.eventStart.toDate());
      const end = dayjs(event.eventEnd.toDate());

      if (end.isBefore(today)) {
        ePast.push(event);
      } else if (start.isAfter(today)) {
        eFuture.push(event);
      } else {
        eCurrent.push(event);
      }
    });

    setEventsCurrent(eCurrent);
    ePast.sort((b, a) => a.eventStart.toDate() - b.eventStart.toDate());
    setEventsPast(ePast);
    setEventsFuture(eFuture);
  }

  const renderSubGrid = (heading, arrayOfEvents) => {
    if (arrayOfEvents.length === 0) return;

    return (
      <Box className="sff-events-section">
        <SectionTitle>
          <Typography variant="h_medium" component="h2" color={theme.palette.primary.contrastText}>
            {heading}
          </Typography>
        </SectionTitle>
        <Box className="sff-events-grid">
          {arrayOfEvents.map((data, index) => (
            <EventBox className="sff-events-grid__event" key={index} onClick={(e) => { handleOpenEvent(e, data.id, data.title) }}>
              <Box style={{display: "flex", gap: "1rem" }}>
                <EventContentBox className="sff-events-grid__event-content">
                  <Box>
                    <Typography variant='h_medium'>
                      {data.title}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="p_small">
                      {data.summary}
                    </Typography>
                  </Box>
                </EventContentBox>
                <EventsGridImage image={data?.image} alt={data?.title} />
              </Box>
              <DateBox event={data} />
            </EventBox>
          ))}
        </Box>
      </Box>
    )
  }

  const handleOpenEvent = (e, id, title) => {
    navigate(`/events/${id}/${slugify(title)}`);
  };

  return (
    <Box>
      {renderSubGrid("Upcoming", eventsFuture)}
      {renderSubGrid("Current events", eventsCurrent)}
      {renderSubGrid("Past events", eventsPast)}
    </Box>
  );
};

export default EventsGrid;