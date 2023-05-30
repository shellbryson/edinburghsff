import React, { useEffect, useState } from 'react';

import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Container from '@mui/material/Container';

// Custom Components
import PageHeading from '../components/PageHeading';
import LinkTiles from '../components/LinkTiles';

export default function AdminLinks() {

  const [links, setLinks] = useState([])

  useEffect(() => {
    getLinks();
  }, [])

  const q = query(collection(db, "links"), orderBy("title", "asc"));

  const getLinks = async () => {
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

  return (
    <>
      <Container maxWidth="md">
        <PageHeading heading="Links" />
      </Container>
      <LinkTiles data={links} />
    </>
  )
}

