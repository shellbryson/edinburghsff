import React, { useEffect, useState } from 'react';

// MUI
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const PageList = ({ data, onDelete, onUpdate }) => {
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
            <TableCell>Slug</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {places.map((data, index) => (
            <TableRow
              onClick={() => onUpdate(data)}
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{data.title}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {data.slug}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PageList;