import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";

import { useHead } from 'hoofd';

import ReactMarkdown from 'react-markdown';

import { getDocs, collection, query, orderBy, where  } from 'firebase/firestore';
import { db } from "../../firebase";

// MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Custom Components
import Spinner from '../../components/Spinner';

const styleCard={
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "1rem"
}

const styleContent={
  height: "100%"
}

const stylePage={
  maxWidth: '80ch',
  margin: '0 auto'
}

export default function Pages() {
  const params = useParams();
  const [page, setPage] = useState({});
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const defaultPageTitle = "Edinburgh SFF"
  const defaultPageDescription = "Edinburgh Science Fiction and Fantasy writing community. New writers, events and community."

  useHead({
    title: `${page[0]?.title} - Edinburgh SFF` || defaultPageTitle,
    language: 'en',
    metas: [{ name: 'description', content: page[0]?.description || defaultPageDescription }],
  });

  useEffect(() => {
    if (params.pageSlug) {
      getPage(params.pageSlug);
    } else {
      getPages();
    }
  }, [params.pageSlug])

  const getPage = async (s) => {
    setIsLoading(true);

    const q = query(collection(db, "pages"), where("url", "==", s));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });

    setPage(l);
    setPages([]);
    setIsLoading(false);
  }

  const getPages = async () => {
    setIsLoading(true);

    const q = query(collection(db, "pages"), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setPage({});
    setPages(l);
    setIsLoading(false);
  }

  const renderPage = () => {
    if (!page.length) {
      return null;
    }
    const firstMatchingPage = page[0];
    const r = <Box style={ stylePage } className="sff-page">
      <Typography variant="h1" component="h1" gutterBottom align='center'>
        {firstMatchingPage.title}
      </Typography>
      <ReactMarkdown children={firstMatchingPage.content} />
    </Box>
    return r;
  }

  const renderPages = () => {
    if (!pages.length) return null;
    const r = <>
      <Typography variant="h1" component="h1" gutterBottom align='center'>
        Pages
      </Typography>
      {pages.map((data, index) => (
        <Card variant="outlined" key={index} style={styleCard}>
          <CardContent style={styleContent}>
            <Stack spacing={2}>
              <Typography component="p" variant='p' gutterBottom>
                <Link to={`/pages/${data.url}`}>{data.title}</Link>
              </Typography>
              <Typography component="p" variant='p' gutterBottom>
                {data.description}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
    return r;
  }

  return (
    <>
      <Container>
        { isLoading && <Spinner />}
        { !isLoading && renderPages() }
        { !isLoading && renderPage() }
      </Container>
    </>
  )
}

