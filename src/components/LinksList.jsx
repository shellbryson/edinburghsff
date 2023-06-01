import React, { useEffect, useState } from 'react';

// MUI
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Custom UI
import EventsListImage from './ListImage';

const LinksList = ({ data, onDelete, onUpdate }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(data);
  }, [data, onDelete, onUpdate])

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table sx={{ minWidth: 500 }} aria-label="List of events">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Image</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {places.map((place, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{place.title}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {place.type}
                </Box>
              </TableCell>
              <TableCell><EventsListImage image={place?.image} alt={place?.title} /></TableCell>
              <TableCell>
                <IconButton size='small' onClick={() => onDelete(place.id)}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
                <IconButton size='small' onClick={() => onUpdate(place)}>
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

export default LinksList;