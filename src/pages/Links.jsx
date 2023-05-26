import React, { useEffect, useState } from 'react';

import { getDocs, collection } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// Custom Components
import LinkList from '../components/LinkList';

export default function AdminLinks() {

  const [links, setLinks] = useState([])

  useEffect(() => {
    getLinks();
  }, [])

  const getLinks = async () => {
    const querySnapshot = await getDocs(collection(db, "links"));
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
    <Container>

      <LinkList data={links} enableAdminActions={false} />

    </Container>
  )
}

