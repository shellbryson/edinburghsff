import React from 'react';
import { Link } from 'react-router-dom';

import { useHead } from 'hoofd';
import ReactMarkdown from 'react-markdown';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Custom Components
import LinkInterceptor from '../components/LinkInterceptor';
import StyledContent from '../components/StyledContent';

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0 1rem",
  color: theme.palette.text.main
}));

const FeedbackBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: "1rem",
  marginBottom: "2rem",
  flexDirection: "column",
  justifyContent: 'center',
  alignItems: 'center',
  padding: "1rem",
  color: theme.palette.text.contrastText,
  backgroundColor: theme.palette.brand.main,
  textAlign: "center",
  'h2': {
    padding: "0"
  },
  'a': {
    color: theme.palette.text.contrastText,
  }
}));

export default function Suggestions() {

  const { config } = useApp();
  const theme = useTheme();

  const style = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    content: {
      textAlign: "left",
      overflow: "auto",
    },
    code: {
      display: "block",
      fontSize: "1.5rem",
      border: `1px solid ${theme.palette.brand.main}`,
      padding: "1rem",
      backgroundColor: theme.palette.brand.faint,
      color: theme.palette.text.main,
    }
  }

  useHead({
    title: "Suggest content - Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "Suggest events, locations or other content for ESFF." }],
  });

  return (
    <Box style={style.page} className="sff-page">
      <Box style={style.paper}>
        <Box style={style.content} className="scroll-dialog">
          <ContentBox>
            <FeedbackBox>
              <Typography component="h2" variant="h_large">
                Feedback
              </Typography>
              <Typography variant="p">
                Something to share with us?
              </Typography>
              <Button variant="outlined" color="form" component={Link} to={config.suggestGoogleForm}>
                Feedback form
              </Button>
              <Box style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #000"}}>
                <Typography variant="p_small">Prefer not to use the form? You can also email <Link href="mailto:admin@edinburghsff.com" color="brand">admin@edinburghsff.com</Link></Typography>
              </Box>
            </FeedbackBox>
            <LinkInterceptor>
              <StyledContent>
                <ReactMarkdown children={config.textSuggestContent} />
              </StyledContent>
            </LinkInterceptor>
          </ContentBox>
        </Box>
      </Box>
    </Box>
  )
}

