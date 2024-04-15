import React, { useEffect, useState } from 'react';

// MUI
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Custom UI
import EventsListImage from './ListImage';

import {imageURL} from '../../utils/utils';

const styleActionBar = {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "1rem",
}

const List = ({ data, onUpdate, onOpenForm, tableStructure }) => {

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setItems(data);
  }, [data, onUpdate])

  const renderTags = (tags) => {
    if (!tags) return;
    const tagArray = tags.split(',');
    return tagArray.map((tag, i) => (
      <Chip key={i} label={tag} size='small'></Chip>
    ));
  }

  const handleFilter = (filterString) => {
    const PATTERN = filterString;
    const filteredItems = items;
    setFilter(PATTERN);

    if (PATTERN !== '') {
      filteredItems.forEach((item) => {
        if (item.title.toLowerCase().includes(PATTERN.toLowerCase())) {
          item.display = true;
        } else {
          item.display = false;
        }
      });
    } else {
      filteredItems.forEach((item) => {
        item.display = true;
      });
    }
  }

  const renderHeadings = () => {
    const h = [];
    tableStructure.headings.forEach((_heading, i) => {
      h.push(<TableCell key={i}>{_heading}</TableCell>)
    })
    return h;
  }

  const renderRow = (item) => {
    const r = [];
    tableStructure.keys.forEach((_key, i) => {
      if (_key === 'tags') {
        r.push(<TableCell key={i}>{renderTags(item[_key])}</TableCell>);
      } else if (_key === 'title') {
        r.push(<TableCell key={i} sx={{width: '40%'}}>{item[_key]}</TableCell>)
      } else if (_key === 'image') {
        r.push(<TableCell key={i} sx={{width: '2rem'}}><EventsListImage image={imageURL(item[_key], 'icon')} alt='*' /></TableCell>)
      } else {
        r.push(<TableCell key={i}>{item[_key]}</TableCell>)
      }
    })
    return r;
  }

  return (
    <Paper>
      <Box style={styleActionBar}>
        <TextField
          value={filter}
          label="Filter"
          size="small"
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button onClick={() => onOpenForm()} variant='outlined'>Add</Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
        <Table sx={{ minWidth: 500 }} aria-label="List of events">
          <TableHead>
            <TableRow>
              {renderHeadings()}
            </TableRow>
          </TableHead>
          <TableBody>
          {items.map((item, index) => {
            if (!item.display) return null;
            return (
              <TableRow
                onClick={() => onUpdate(item)}
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {renderRow(item)}
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default List;