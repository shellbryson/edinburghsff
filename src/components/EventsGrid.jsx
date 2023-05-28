import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// Custom UI
import EventsGridImage from './EventsGridImage';

const styleGrid={
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "0.5rem",
  marginTop: "2rem"
}

const styleGridCell={
  display: "block",
  position: "relative",
  aspect: "1/1",
}

const styleGridContent={
  display: "block",
  position: "absolute",
  aspect: "1/1",
  zIndex: 2,
  top: 0,
  left: 0
}

const styleEventDate={
  display: "block",
  position: "absolute",
  zIndex: 3,
  top: "1rem",
  left: "1rem"
}

const EventsList = ({ data }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data])

  const eventDate = (eventStartDate) => {
    const d = dayjs(eventStartDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY')
    return <Typography component="p" variant='h1' style={styleEventDate}>{d}</Typography>;
  }

  return (
    <Box style={styleGrid}>
      {links.map((data, index) => (
        <Box style={styleGridCell} key={index}>
          <EventsGridImage image={data?.image} alt={data?.title} />
          { eventDate(data?.eventStart) }
          <Box style={styleGridContent}>
            <Stack spacing={2}>
              <Typography gutterBottom>
                {data.title}
              </Typography>
              <Typography variant="p">
                {data.description}
              </Typography>
              <Typography variant="p">
                <a href={data.url} target='_blank' rel='noreferrer'>{data.url}</a>
              </Typography>
            </Stack>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EventsList;