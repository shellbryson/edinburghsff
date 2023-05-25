import React, { useEffect, useState } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const LinkList = ({ data, onDelete, onUpdate }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data])

  return (
    <div className="sff-grid">
      {links.map((data, index) => (
        <Card variant="outlined">
          <CardContent>
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
          </CardContent>
          <CardActions>
            <Button size='small' onClick={() => onDelete(data.id)}>Delete</Button>
            <Button size='small' onClick={() => onUpdate(data)}>Update</Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default LinkList;