import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';

// Assets
import 'react-calendar/dist/Calendar.css';

export default function EventsCalendarPanel({onClickDate, events}) {

  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const style = {
    events: {
      display: "flex",
      position: "relative",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "2rem",
    }
  }

  // useEffect(() => {
  //   if (events.length === 0) return;
  //   setEventsData(events);
  // }, [events])

  const onChange = (date) => {
    onClickDate(date);
    setSelectedDate(date);
  }

  function tileClassName({ date, view }) {
    if (events.length === 0) return;

    console.log("DATE", date);

    events.forEach(event => {
      const start = dayjs(event.eventStart.toDate());
      const calendarDate = dayjs(date);
      if (start.isSame(calendarDate, 'day')) {
        return 'test';
      }
    })
    // Add class to tiles in month view only
    // if (view === 'month') {
    //   // Check if a date React-Calendar wants to check is on the list of dates to add class to
    //   if (events.find(dDate => isSameDay(dDate, date))) {
    //     return 'test';
    //   }
    // }
  }
  return (
    <Box style={style.events} className="sff-panel-events">
      <Typeography component="h2" variant="h_small_lined">Calendar</Typeography>
      <Calendar onChange={onChange} tileClassName={tileClassName} defaultView="year" value={selectedDate} />
    </Box>
  );
}
