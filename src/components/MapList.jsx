import React, { useEffect, useState } from 'react';

// MUI
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Custom UI
import ListImage from './ListImage';

const MapList = ({ data, onDelete, onUpdate }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(data);
  }, [data, onDelete, onUpdate])

  const renderLocationTags = (tags) => {
    if (!tags) return;
    const tagArray = tags.split(',');
    return tagArray.map((tag, i) => (
      <Chip key={i} label={tag} />
    ));
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table sx={{ minWidth: 500 }} aria-label="List of events">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {places.map((place, index) => (
            <TableRow
              onClick={() => onUpdate(place)}
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{place.title}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {place.tags && renderLocationTags(place.tags)}
                </Box>
              </TableCell>
              <TableCell><ListImage image={place?.image} alt={place?.title} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MapList;