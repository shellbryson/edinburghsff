import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";

import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// Custom Components
import PageHeading from '../components/PageHeading';
import LinkTiles from '../components/LinkTiles';
import { Typography } from '@mui/material';

const classiciationsMenuStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem'
}

export default function AdminLinks() {
  const params = useParams();
  const [links, setLinks] = useState([]);
  const [linkClassification, setLinkClassification] = useState([]);
  const defaultClassification = "conventions";

  useEffect(() => {
    getLinks(params.classification || defaultClassification);
    setLinkClassification(params.classification || defaultClassification);
  }, [params.classification])

  const getLinks = async (classification) => {
    const q = query(collection(db, "links"), where("type", "==", classification),  orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setLinks(l);
  }

  const subtitle = (linkClassification) => {
    let title = '';
    switch (linkClassification) {
      case 'conventions':
        title = 'Conventions and Festivals';
        break;
      case 'authors':
        title = 'Writers and authors who are members of the community';
        break;
      case 'events':
        title = 'Event homepages';
        break;
      case 'magazines':
        title = 'SF/F Magazines for writers and readers';
        break;
      case 'publishers':
        title = 'Science Fiction and Fantasy publishers';
        break;
      case 'resources':
        title = 'Useful writing resources';
        break;
    }
    return title;
  }

  return (
    <>
      <Container maxWidth="md">
        <PageHeading heading="Links" />
        <Box style={classiciationsMenuStyle}>
          <Link to="/links/conventions">Conventions</Link>
          <Link to="/links/authors">Authors</Link>
          <Link to="/links/events">Events</Link>
          <Link to="/links/magazines">Magazines</Link>
          <Link to="/links/publishers">Publishers</Link>
          <Link to="/links/resources">Writing resources</Link>
        </Box>
        <Typography variant="p" component="h2" gutterBottom align='center' sx={{ marginBottom: "2rem" }}>
          {subtitle(linkClassification)}
        </Typography>
      </Container>
      <LinkTiles data={links} classification={linkClassification} />
    </>
  )
}

