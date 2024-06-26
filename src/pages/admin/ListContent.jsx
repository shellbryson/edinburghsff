import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// Contexts
import { useApp } from '../../context/AppContext';

// MUI
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
import Loader from '../../components/Loader';
import AdminLayout from '../../layouts/AdminLayout';

import {
  fetchDocuments,
  fetchLocationsForMapDisplay,
  imageURL
} from '../../utils/utils';

export default function ListContent() {

  const params = useParams();
  const navigate = useNavigate();

  const { setAdminDialogTitle } = useApp();

  const [tableStructure, setTableStructure] = useState({});
  const [tableFilterOn, setTableFilterOn] = useState("title");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
      gap: "0.5rem",
      margin: "0 1rem"
    }
  }

  useEffect(() => {
    if (params.type === 'locations') {
      setIsLoading(true);
      setTableStructure({ headings: ['Location name'], keys: ['name'] });
      setTableFilterOn('name');
      fetchLocationsForMapDisplay((data) => {
        data.forEach((item) => {
          item.display = true;
        });
        setItems(data);
        setIsLoading(false);
      });
    } else if (params.type === 'events') {
      setIsLoading(true);
      setTableFilterOn('title');
      setTableStructure({ headings: ['Date', 'Event Title', ""], keys: ['eventStart', 'title', 'image'] });
      fetchDocuments(params.type, {field:'eventStart', mode:'desc'}, (data) => {
        data.forEach((item) => {
          item.display = true;
        });
        setItems(data);
        setIsLoading(false);
      });
    } else if (params.type === 'pages') {
      setIsLoading(true);
      setTableFilterOn('title');
      setTableStructure({ headings: ['Title', ""], keys: ['title', 'image'] });
      fetchDocuments(params.type, {field:'title', mode:'asc'}, (data) => {
        data.forEach((item) => {
          item.display = true;
        });
        setItems(data);
        setIsLoading(false);
      });
    } else if (params.type === 'lists') {
      setIsLoading(true);
      setTableFilterOn('title');
      setTableStructure({ headings: ['Title'], keys: ['title'] });
      fetchDocuments(params.type, {field:'title', mode:'asc'}, (data) => {
        data.forEach((item) => {
          item.display = true;
        });
        setItems(data);
        setIsLoading(false);
      });
    }
    handleFilter('');
    setAdminDialogTitle(params.type);
  }, [params.type]);

  const handleFilter = (filterString) => {
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
      h.push(<TableCell key={i}><strong>{_heading}</strong></TableCell>)
    })
    return h;
  }

  const renderRow = (item) => {
    if (items.length === 0) return;
    const r = [];
    tableStructure.keys.forEach((_key, i) => {
      if (_key === 'name') {
        r.push(<TableCell key={i} sx={{width: '40%'}}>{item[_key]}</TableCell>)
      } else if (_key === 'eventStart') {
        if (!item[_key]) {
          r.push(<TableCell key={i}>No date</TableCell>)
        } else {
          const d = dayjs(item[_key].toDate()).format('DD/MM/YYYY');
          r.push(<TableCell key={i} sx={{width: '2rem'}}>{d}</TableCell>)
        }
      } else if (_key === 'image') {
        r.push(<TableCell key={i} sx={{width: '2rem'}}><EventsListImage image={imageURL(item[_key], 'icon')} alt='*' /></TableCell>)
      } else {
        r.push(<TableCell key={i}>{item[_key]}</TableCell>)
      }
    })
    return r;
  }

  const onAddItem = () => {
    navigate(`/admin/${params.type}/add/`);
  }

  const onOpenItem = (item) => {
    navigate(`/admin/${params.type}/update/${item.id}`);
  }

  const renderTable = () => {
    if (items.length === 0) return;
    return (
      <Table aria-label="List of events">
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
              onClick={() => onOpenItem(item)}
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
    <AdminLayout>
      {isLoading && <Loader />}
      {!isLoading && <>
        <Box style={style.actionbar}>
          <TextField
            value={filter}
            label="Filter"
            size="small"
            onChange={(e) => handleFilter(e.target.value)}
          />
          <Button onClick={() => onAddItem()} variant='outlined' color="form" startIcon={<LibraryAddIcon />}>Add</Button>
        </Box>
        <TableContainer component={Box} sx={{ mt: 2, mb: 1 }}>
          {renderTable()}
        </TableContainer>
      </>}
    </AdminLayout>
  );
};