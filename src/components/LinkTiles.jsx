import React, { useEffect, useState } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
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

const styleActions={
  justifyContent:"center",
  borderTop: "1px solid #ccc"
}

const LinkTiles = ({ data, onDelete, onUpdate, enableAdminActions }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data, onDelete, onUpdate])

  return (
    <Container maxWidth="md">
      {links.map((data, index) => (
        <Card variant="outlined" key={index} style={styleCard}>
          <CardContent style={styleContent}>
            <Stack spacing={2}>
              <Typography component="p" variant='h2' gutterBottom>
                {data.title}
              </Typography>
              <Typography variant="p">
                {data.description}
              </Typography>
              <Typography variant="p">
                <a href={data.url} target='_blank' rel='noreferrer'>{data.url}</a>
              </Typography>
            </Stack>
            <LinkTileImage image={data?.image} alt={data?.title} />
          </CardContent>
          { enableAdminActions &&
            <CardActions style={styleActions}>
              <Button size='small' onClick={() => onDelete(data.id)}>Delete</Button>
              <Button size='small' onClick={() => onUpdate(data)}>Update</Button>
            </CardActions>
          }
        </Card>
      ))}
    </Container>
  );
};

export default LinkTiles;