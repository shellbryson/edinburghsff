import React, { useEffect, useState } from 'react';

import ReactMarkdown from 'react-markdown';

import {imageURL} from '../utils/utils';

// MUI
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// Custom UI
import LinkTileImage from './LinkTileImage';

const styleCard={
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "1rem"
}

const styleContent={
  height: "100%"
}

const LinkTiles = ({ data }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data])

  return (
    <Container maxWidth="md">
      {links.map((data, index) => (
        <Card variant="outlined" key={index} style={styleCard}>
          <CardContent style={styleContent}>
            <Stack spacing={2}>
              <Typography component="p" variant='h2' gutterBottom>
                {data.title}
              </Typography>
              <ReactMarkdown children={data.description} />
              <Typography variant="p">
                <a href={data.url} target='_blank' rel='noreferrer'>{data.url}</a>
              </Typography>
            </Stack>
            <LinkTileImage image={imageURL(data?.image, 'thumb')} alt={data?.title} />
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default LinkTiles;