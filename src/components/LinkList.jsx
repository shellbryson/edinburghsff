import React, { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';

// MUI
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';


// Custom UI
import LinkListImage from './LinkListImage';

const styleCard={
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}

const styleContent={
  height: "100%"
}

const styleActions={
  justifyContent:"center",
  borderTop: "1px solid #ccc"
}

const LinkList = ({ data, onDelete, onUpdate, enableAdminActions }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data, onDelete, onUpdate])

  return (
    <div className="sff-linklist-grid">
      {links.map((data, index) => (
        <Card variant="outlined" key={index} style={styleCard}>
          <CardContent style={styleContent}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Stack spacing={2}>
                  <Typography gutterBottom>
                    {data.title}
                  </Typography>
                  <Typography variant="p">
                    {data.description}
                  </Typography>
                  <Typography variant="p">
                    <a href={data.url} target='_blank' rel='noreferrer'>{data.url}</a>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <LinkListImage image={data?.image} alt={data?.title} />
              </Grid>
            </Grid>
          </CardContent>
          { enableAdminActions &&
            <CardActions style={styleActions}>
              <Button size='small' onClick={() => onDelete(data.id)}>Delete</Button>
              <Button size='small' onClick={() => onUpdate(data)}>Update</Button>
            </CardActions>
          }
        </Card>
      ))}
    </div>
  );
};

export default LinkList;