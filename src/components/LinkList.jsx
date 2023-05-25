import React, { useEffect, useState } from 'react';

// MUI
import Button from '@mui/material/Button';

const LinkList = ({ data, onDelete, onUpdate }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(data);
  }, [data])

  return (
    <>
      {links.map((data, index) => (
        <div key={index}>
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <a href={data.url} target='_blank' rel='noreferrer'>{data.url}</a>
          <Button size='small' onClick={() => onDelete(data.id)}>Delete</Button>
          <Button size='small' onClick={() => onUpdate(data)}>Update</Button>
        </div>
      ))}
    </>
  );
};

export default LinkList;