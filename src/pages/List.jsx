import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Custom UI
import Loader from '../components/Loader';
import StyledContent from '../components/StyledContent';

// Helpers
import {
  fetchDocument,
  imageURL
} from '../utils/utils';

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

  return (
    <>
      { isLoading && <Loader />}
      { !isLoading && <Box style={style.page} className="sff-list">
        <StyledContent>
          <Box style={style.content} className="scroll">
            <Typography component="h1" variant='h_medium' style={{ marginTop: "0", marginBottom: "0"}}>
              {listData.title}
            </Typography>
            { listData.items.map((item, index) => {
              return <Box key={index}>
                <Typography>{item.title}</Typography>
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </Box>
            })}
          </Box>
        </StyledContent>
      </Box>
      }
    </>
  )
}

