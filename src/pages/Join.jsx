import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';

import { db } from "../firebase";
import { useHead } from 'hoofd';
import ReactMarkdown from 'react-markdown';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Custom Components
import PageHeading from '../components/PageHeading';
import LinkInterceptor from '../components/LinkInterceptor';

const ContentBox = styled(Box)(({ theme }) => ({
  padding: "0 1rem",
  color: theme.palette.text.main
}));

export default function Join() {

  const { config } = useApp();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    }
  }

  useHead({
    title: "Join - Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "Join our community" }],
  });

  const handleSubmit = async (e) => {
    if (!email || !password) return;

    e.preventDefault();
    setError('');

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Firebase User Created", userCredential);
      createUserAccount(userCredential);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error creating user", errorCode, errorMessage);
      setIsLoading(false);
    });
  };

  const createUserAccount = async (userCredential) => {
    // Update user record to match newly created user
    const payload = {
      name: name,
      role: "author",
      email: email
    }

    console.log("userCredential!!!!", userCredential.user.uid);

    try {
      const docRef = doc(db, "users", userCredential.user.uid);
      const d = await setDoc(docRef, payload);

      console.log("Saved Account", d);
      setIsLoading(false);
      //navigate(`/admin/accounts/update/${d.id}`, { replace: true });
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  }

  return (
    <Box style={style.page} className="sff-page">
      <Box style={style.paper}>
        <Box style={style.content} className="scroll-dialog">
          <PageHeading heading="Join" />
          <ContentBox>
            <LinkInterceptor>
              <ReactMarkdown children={config.textEventIntro} />
            </LinkInterceptor>
          </ContentBox>
          <Stack spacing={2} sx={{ mt: 2}}>
            <Typography variant="body1" component="span">Join...</Typography>
            <form onSubmit={handleSubmit}>
              <TextField required value={name} label="name" onChange={(e) => setName(e.target.value)} type='name' />
              <TextField required value={email} label="email" onChange={(e) => setEmail(e.target.value)} type='email' />
              <TextField required value={password} label="password" onChange={(e) => setPassword(e.target.value)} type='password' />
              { error && <Alert severity="warning">{error}</Alert> }
              <Button variant='contained' type="submit">
                Create Account
              </Button>
            </form>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

