import React, { useEffect, useState } from 'react';
import { useHead } from 'hoofd';
import ReactMarkdown from 'react-markdown';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Custom Components
import Loader from '../components/Loader';
import PageHeading from '../components/PageHeading';
import LinkInterceptor from '../components/LinkInterceptor';
import StyledContent from '../components/StyledContent';

// Assets
import Masthead from '../assets/DiscordMasthead.png';

const ContentBox = styled(Box)(({ theme }) => ({
  color: theme.palette.text.main
}));

const DiscordBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "2rem 0",
  background: theme.palette.highlight.main,
  padding: "2rem",
  gap: "0.5rem",
  color: theme.palette.text.main
}));

export default function Community() {

  const { config, isLoadingConfig } = useApp();
  const theme = useTheme();
  const [showDiscord, setShowDiscord] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const style = {
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
    title: "Community - Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "What is ESFF and how to become part of the community." }],
  });

  const handleViewDiscord = () => {
    setShowDiscord(showDiscord => !showDiscord);
  }

  const handleDiscordClick = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(config.discordLink);
  }

  const handleVisitDiscord = () => {
    window.open(config.discordLink, "_blank");
  }

  return (
    <>
      { isLoadingConfig && <Loader />}
      { !isLoadingConfig && (
      <Box style={style.page} className="sff-page">
        <Box style={style.content} className="scroll-dialog">

          <Box style={{display: "flex", justifyContent: "center"}}>
            <img src={Masthead} alt="Discord Masthead" style={{width: "100%", height: "auto", marginBottom: "1rem"}} />
          </Box>

          <PageHeading heading="Edinburgh SFF Community" />
          <ContentBox>
            <LinkInterceptor>
              <StyledContent>
                <ReactMarkdown children={config.textCommunity} />
              </StyledContent>
            </LinkInterceptor>

            {!showDiscord && (
              <Box style={{display: "flex", justifyContent: "center", marginTop: "2rem"}}>
                <Button variant="outlined" color="brand" onClick={(e) => handleViewDiscord(e)}>Access Discord</Button>
              </Box>
            )}

            {showDiscord && (
              <DiscordBox>
                <code style={style.code} onClick={() => handleDiscordClick() }>{config.discordLink.replace('https://', '')}</code>
                <Typography variant="body2">Tap code copy, or hit the button below.</Typography>
                { isCopied && <Typography variant="body2">Copied!</Typography>}
                <Box style={{marginTop: "1rem"}}>
                  <Button variant="outlined" color="brand" onClick={(e) => handleVisitDiscord(e)}>Open Discord</Button>
                </Box>
              </DiscordBox>
            )}

          </ContentBox>
        </Box>
      </Box>
      )}
    </>
  )
}

