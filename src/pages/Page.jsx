import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import ReactMarkdown from 'react-markdown';

import { getDocs, collection, query, where  } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Custom UI
import Header from '../components/Header';
import Loader from '../components/Loader';
import LinkInterceptor from '../components/LinkInterceptor';
import List from './List';
import StyledContent from '../components/StyledContent';

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

export default function Pages() {
  const theme = useTheme();
  const params = useParams();
  const [page, setPage] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    const thisPage = page[0];
    const r = <Box style={style.page} className="sff-page">
      <Header meta={{title: thisPage.title, description: thisPage.description, image: thisPage?.image}} />
      <StyledContent>
        <Box style={style.content} className="scroll">
          <Typography component="h1" variant='h_large' style={{marginTop: "0", marginBottom: "0"}}>
            {thisPage.title}
          </Typography>
          <LinkInterceptor>
            <ReactMarkdown children={thisPage.content} />
            {thisPage?.list && <List listID={thisPage.list} />}
          </LinkInterceptor>
        </Box>
      </StyledContent>
    </Box>
    return r;
  }

  return (
    <>
      { isLoading && <Loader />}
      { !isLoading && renderPage() }
    </>
  )
}

