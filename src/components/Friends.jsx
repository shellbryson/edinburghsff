import React from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const headingStyle = {
  textAlign: "center",
}

const friends = [
  {
    title: "Luna Press Publishing",
    description: "Luna Press Publishing is an independent press founded in 2015, specialising in speculative fiction and non-fiction. We publish books that are not mainstream to help readers escape the everyday and experience different worlds, ideas and stories.",
    image: "/images/friends/1.jpg",
    url: "https://www.google.com",
  }
]


const Friends = () => {

  return (
    <Box>
      {friends.map((friend, i) => (
        <Box key={i}><img src={friend.image} alt={friend.title} /></Box>
      ))}
    </Box>
  );
};

export default Friends;