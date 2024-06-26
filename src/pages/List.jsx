import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Icons: Tags
import OpenInNewIcon from '@mui/icons-material/OpenInNew';  // Link
import DescriptionIcon from '@mui/icons-material/Description'; // Page
import PodcastsIcon from '@mui/icons-material/Podcasts'; // Podcast
import PlaceIcon from '@mui/icons-material/Place'; // Location
import EventIcon from '@mui/icons-material/Event'; // Event
import InfoIcon from '@mui/icons-material/Info';

// Custom UI
import Loader from '../components/Loader';
import StyledContent from '../components/StyledContent';

// Helpers
import {
  fetchDocument,
} from '../utils/utils';

const ListBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  position: "relative",
  marginTop: "0",
  marginBottom: "2rem"
}));

const ListEntry = styled(({ highlightItem, ...otherProps }) => <Box {...otherProps} />)(({ theme, highlightItem }) => ({
  display: "flex",
  position: "relative",
  gap: "1rem",
  padding: "1rem",
  background: highlightItem ? theme.palette.highlight.main : "transparent",
  border: highlightItem ? "none" : `2px solid ${theme.palette.highlight.main}`,
  '& p:last-child': {
    marginBottom: "0"
  }
}));

const ListContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  width: "100%"
}));

const ListEntryTitle = styled(Typography)(({ theme }) => ({
  margin: "0",
  paddingBottom: "0",
}));

export default function List({listID}) {
  const theme = useTheme();
  const [listData, setListData] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!listID) return;
    getList(listID);
  }, [listID])

  const getList = () => {
    setIsLoading(true);
    fetchDocument("lists", listID, (list) => {
      setListData(list);
      setIsLoading(false);
      console.log("List Data:", list);
    });
  }

  const IconComponent = ({tagName}) => {
    let icon = null;
    switch(tagName) {
      case "link":
        icon = <OpenInNewIcon color="brand" style={{ pointerEvents: "none"}} />
        break;
      case "event":
        icon = <EventIcon color="brand" style={{ pointerEvents: "none"}} />
        break;
      case "page":
        icon = <DescriptionIcon color="brand" style={{ pointerEvents: "none"}} />
        break;
      case "podcast":
        icon = <PodcastsIcon color="brand" style={{ pointerEvents: "none"}}  />
        break;
      case "location":
        icon = <PlaceIcon color="brand" style={{ pointerEvents: "none"}} />
        break;
      case "info":
        icon = <InfoIcon color="brand" style={{ pointerEvents: "none"}} />
        break;
      default:
        icon = <OpenInNewIcon color="brand" style={{ pointerEvents: "none"}} />
    }
    return icon;
  }

  return (
    <>
      { isLoading && <Loader />}
      { !isLoading && <Box className="sff-list" style={{ marginTop: "2rem"}}>
        <StyledContent>
          <ListBox>
            { listData.items.map((item, index) => {

              if (item?.type === "section") return <Box key={index}>
                <Typography variant="h_medium" style={{ display: "block", marginTop: "1rem", paddingBottom: "0"}}>
                  {item.title}
                </Typography>
              </Box>

              return <ListEntry key={index} highlightItem={item?.highlight}>
                { item.url && <a href={item.url} target="_blank" rel="noreferrer"><IconComponent tagName={item?.tag} /></a> }
                { !item.url && <IconComponent tagName={item?.tag} /> }
                <ListContent>
                  <ListEntryTitle variant="h_medium" style={{marginBottom: "0", lineHeight: "1"}}>
                    { item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a> : item.title }
                  </ListEntryTitle>
                  <Box>
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                    { item.url && <> View <a href={item.url} target="_blank" rel="noreferrer">{item?.urlTitle !== "" ? item.urlTitle : item.title}</a></> }
                  </Box>
                </ListContent>
              </ListEntry>

            })}
          </ListBox>
        </StyledContent>
      </Box>
      }
    </>
  )
}

