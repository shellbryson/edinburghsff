import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import dayjs, { isSameOrBefore } from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';

// Assets
import 'react-calendar/dist/Calendar.css';

// function isSameDay(a, b) {
//   return differenceInCalendarDays(a, b) === 0;
// }

export default function EventsCalendarPanel({onClickDate, events}) {

  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDates, setEventDates] = useState([]);

  const style = {
    events: {
      display: "flex",
      position: "relative",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "2rem",
    }
  }

  useEffect(() => {
    if (events.length === 0) return;

    console.log("Got events", events);

    const d = [];

    // get the start date of each event
    events.forEach(event => {
      const s = dayjs(event.eventStart.toDate());
      const e = dayjs(event.eventEnd.toDate());

      //console.log(s, e);

      // if (s.isSame(e, 'day')) {
      //   d.push(s);
      // } else {
      //   let currentDate = s.format('YYYY-MM-DD');
      //   while (s.isSameOrBefore(e, 'day')) {
      //     d.push(currentDate.format('YYYY-MM-DD'));
      //     currentDate = currentDate.add(1, 'day'); // Correctly update currentDate
      //   }
      // }
    });

    setEventDates(d); // Pass the correct array to eventDates
  }, [events]);

  const onChange = (date) => {
    onClickDate(date);
    setSelectedDate(date);
  }

  function tileClassName({ date, view }) {
    if (eventDates.length === 0) return;

    const calendarDate = dayjs(date);

    eventDates.forEach(event => {
      const s = event.format('YYYY-MM-DD');
      const c = calendarDate.format('YYYY-MM-DD');
      if (s === c) {
        hasEvent = true;
      }
    })

    if (hasEvent) {
      return "THIS DATE HAS AN EVENT";
    }
  }
  return (
    <Box style={style.events} className="sff-panel-events">
      <Typeography component="h2" variant="h_small_lined">Calendar</Typeography>
      <Calendar onChange={onChange} tileClassName={tileClassName} defaultView="year" value={selectedDate} />
    </Box>
  );
}
