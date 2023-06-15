import React, { useEffect, useState } from 'react';

import {imageURL} from '../utils/utils';

// MUI
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import dayjs from 'dayjs';

// Custom UI
import ListImage from './ListImage';

const EventsList = ({ data, onDelete, onUpdate }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data, onDelete, onUpdate])

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table sx={{ minWidth: 500 }} aria-label="List of events">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((data, index) => (
            <TableRow
              onClick={() => onUpdate(data)}
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" ><Typography>{dayjs(data.eventStart.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY')}</Typography></TableCell>
              <TableCell>{data.title}</TableCell>
              <TableCell><ListImage image={imageURL(data?.image, 'icon')} alt={data?.title} /></TableCell>
              <TableCell>{data.eventLocation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventsList;