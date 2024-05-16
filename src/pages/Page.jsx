import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { useHead } from 'hoofd';

import ReactMarkdown from 'react-markdown';

import { getDocs, collection, query, where  } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Custom UI
import Spinner from '../components/Spinner';
import LinkInterceptor from '../components/LinkInterceptor';
import StyledContent from '../components/StyledContent';

export default function Pages() {
  const theme = useTheme();
  const params = useParams();
  const [page, setPage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const defaultPageTitle = "Edinburgh SFF"
  const defaultPageDescription = "Edinburgh Science Fiction and Fantasy writing community. New writers, events and community."

  const style={
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      margin: "0",
      padding: "0",
    },
    content: {
      textAlign: "left",
      padding: "0",
      margin: "0",
    },
  }

  useHead({
    title: `${page[0]?.title} - Edinburgh SFF` || defaultPageTitle,
    language: 'en',
    metas: [{ name: 'description', content: page[0]?.description || defaultPageDescription }],
  });

  useEffect(() => {
    if (!params.pageSlug) return;
    getPage(params.pageSlug);
  }, [params.pageSlug])

  const getPage = async (s) => {
    setIsLoading(true);
    const q = query(collection(db, "pages"), where("slug", "==", params.pageSlug));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setPage(l);
    setIsLoading(false);
  }

  const renderPage = () => {
    if (!page.length) {
      return null;
    }
    const firstMatchingPage = page[0];
    const r = <Box style={style.page} className="sff-page">
      <StyledContent>
        <Box style={style.content} className="scroll">
          <Typography component="h1" variant='h_large' style={{ marginTop: "0", marginBottom: "0"}}>
            {firstMatchingPage.title}
          </Typography>
          <LinkInterceptor>
            <ReactMarkdown children={firstMatchingPage.content} />
          </LinkInterceptor>
        </Box>
      </StyledContent>
    </Box>
    return r;
  }

  return (
    <>
      { isLoading && <Spinner />}
      { !isLoading && renderPage() }
    </>
  )
}

