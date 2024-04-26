import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";

// MUI
import Typography from '@mui/material/Typography';
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

// Icons
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

// Custom UI
import EventsListImage from '../../components/admin/ListImage';

import {
  fetchDocuments,
  fetchLocationsForMapDisplay
} from '../../utils/utils';

export default function ListContent() {

  const params = useParams();

  const [tableStructure, setTableStructure] = useState({});
  const [tableFilterOn, setTableFilterOn] = useState("title");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');

  const style = {
    heading: {
      display: "flex",
      justifyContent: "center",
      textTransform: "capitalize",
      textAlign: "center",
      paddingTop: "2rem"
    },
    actionbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "1rem",
      paddingRight: "1rem"
    }
  }

  useEffect(() => {
    if (params.type === 'locations') {
      setTableStructure({ headings: ['Location'], keys: ['name'] });
      setTableFilterOn('name');
      fetchLocationsForMapDisplay((data) => {
        data.forEach((item) => {
          item.display = true;
        });
        setItems(data);
      });
    } else if (params.type === 'events' || params.type === 'pages' || params.type === 'links') {
      setTableFilterOn('title');
      setTableStructure({ headings: ['Title'], keys: ['title'] });
      fetchDocuments(params.type, (data) => {
        data.forEach((item) => {
          item.display = true;
        });
        setItems(data);
      });
    }
    handleFilter('');
  }, [params.type]);

  useEffect(() => {
    console.log("ITEMS", items)
  }, [items]);

  const handleFilter = (filterString) => {
    console.log("FILTER", filterString);
    const PATTERN = filterString;
    const filteredItems = items;
    setFilter(PATTERN);

    if (PATTERN !== '') {
      filteredItems.forEach((item) => {
        if (item[tableFilterOn].toLowerCase().includes(PATTERN.toLowerCase())) {
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
    if (items.length === 0) return;
    const h = [];
    tableStructure.headings.forEach((_heading, i) => {
      h.push(<TableCell key={i}>{_heading}</TableCell>)
    })
    return h;
  }

  const renderRow = (item) => {
    if (items.length === 0) return;
    const r = [];
    tableStructure.keys.forEach((_key, i) => {
      if (_key === 'tags') {
        r.push(<TableCell key={i}>{renderTags(item[_key])}</TableCell>);
      } else if (_key === 'name') {
        r.push(<TableCell key={i} sx={{width: '40%'}}>{item[_key]}</TableCell>)
      } else if (_key === 'image') {
        r.push(<TableCell key={i} sx={{width: '2rem'}}><EventsListImage image={imageURL(item[_key], 'icon')} alt='*' /></TableCell>)
      } else {
        r.push(<TableCell key={i}>{item[_key]}</TableCell>)
      }
    })
    return r;
  }

  const renderTable = () => {
    if (items.length === 0) return;
    return (
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
              sx={{ cursor: "pointer", '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {renderRow(item)}
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
    )
  }

  return (
    <Paper>
      <Box style={style.heading}>
        <Typography variant="h1">{params.type}</Typography>
      </Box>
      <Box style={style.actionbar}>
        <TextField
          value={filter}
          label="Filter"
          size="small"
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button onClick={() => onOpenForm()} variant='outlined' color="form" startIcon={<LibraryAddIcon />}>Add</Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
        {renderTable()}
      </TableContainer>
    </Paper>
  );
};