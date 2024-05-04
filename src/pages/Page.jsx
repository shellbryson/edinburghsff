import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { useHead } from 'hoofd';

import ReactMarkdown from 'react-markdown';

import { getDocs, collection, query, where  } from 'firebase/firestore';
import { db } from "../firebase";

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
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
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const defaultPageTitle = "Edinburgh SFF"
  const defaultPageDescription = "Edinburgh Science Fiction and Fantasy writing community. New writers, events and community."

  const Page = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    background: theme.palette.brand.faint,
    color: theme.palette.text.main,
    borderRadius: "0",
    '& p' : {
      marginBottom: "1rem",
      padding: 0,
    },
    '& a' : {
      color: theme.palette.brand.main,
      textDecoration: "underline",
    },
    '& h1' : {
      textAlign: "center",
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    '& h2, h3' : {
      display: "inline-block",
      textTransform: 'uppercase',
      padding: '6px 1rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      backgroundColor: "rgba(255,255,255,.05)",
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    '& h2::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      right: "0",
      top: "0",
    },
    '& code': {
      display: "inline-block",
      border: "1px solid rgba(255,255,255,.05)",
      padding: "4px 8px",
      marginBottom: "2px",
      color: theme.palette.brand.dark,
      fontWeight: "var(--font-body-bold-weight)"
    },
  }));

  const style={
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      margin: "0",
      padding: "0",
    },
    content: {
      textAlign: "left",
      minHeight: "calc(100vh -2rem)",
      padding: "0",
      margin: "0",
      // padding: "0.5rem 1rem 0.5rem 0.5rem",
      // margin: "0.5rem",
      overflow: "auto",
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
    setPages([]);
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

