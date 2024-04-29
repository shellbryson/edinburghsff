import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";

import { useHead } from 'hoofd';

import ReactMarkdown from 'react-markdown';

import { getDocs, collection, query, orderBy, where  } from 'firebase/firestore';
import { db } from "../../firebase";

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Custom UI
import Spinner from '../../components/Spinner';
import PageHeading from '../../components/PageHeading';
import LinkInterceptor from '../../components/LinkInterceptor';

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
    '& code': {
      display: "inline-block",
      backgroundColor: "rgba(255,255,255,.05)",
      borderRadius: "4px",
      padding: "4px 8px",
      fontWeight: "var(--font-body-bold-weight)"
    },
    '& a' : {
      color: theme.palette.brand.main,
      textDecoration: "underline",
    },
  }));

  const style={
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      margin: "0 1rem 1rem 1rem",
    },
    content: {
      textAlign: "left",
      minHeight: "calc(100vh -2rem)",
      padding: "0.5rem",
      margin: "0.5rem",
      overflow: "auto",
    },
    card:{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: "1rem"
    },
  }

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

    console.log("firstMatchingPage", firstMatchingPage)

    const r = <Box style={style.page} className="sff-page">
      <Page>
        <Box style={style.content} className="scroll">
          <PageHeading heading={firstMatchingPage.title} />
          <LinkInterceptor>
            <ReactMarkdown children={firstMatchingPage.content} />
          </LinkInterceptor>
        </Box>
      </Page>
    </Box>
    return r;
  }

  const renderPages = () => {
    if (!pages.length) return null;
    const r = <>
      <PageHeading heading="Pages" />
      {pages.map((data, index) => (
        <Card variant="outlined" key={index} style={styleCard}>
          <CardContent style={style.content}>
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
      { isLoading && <Spinner />}
      { !isLoading && renderPages() }
      { !isLoading && renderPage() }
    </>
  )
}

