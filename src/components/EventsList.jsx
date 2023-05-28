import React, { useEffect, useState } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import dayjs from 'dayjs';

// Custom UI
import EventsListImage from './EventsListImage';

const styleCard={
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}

const styleContent={
  height: "100%"
}

const styleActions={
  justifyContent:"center",
  borderTop: "1px solid #ccc"
}

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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((data, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" ><Typography>{dayjs(data.eventStart.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY')}</Typography></TableCell>
              <TableCell>{data.title}</TableCell>
              <TableCell><EventsListImage image={data?.image} alt={data?.title} /></TableCell>
              <TableCell>{data.eventLocation}</TableCell>
              <TableCell>
                <IconButton size='small' onClick={() => onDelete(data.id)}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
                <IconButton size='small' onClick={() => onUpdate(data)}>
                  <ModeEditOutlineOutlinedIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventsList;