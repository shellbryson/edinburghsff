import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Signin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  };

  return (
    <Container>
      <Typography component="h1" variant='h1'>Sign in</Typography>
      <Typography component="p">Sign in to access the admin Dashboard.</Typography>

      <Paper sx={{ p: 2, mt: 4}} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField label="Email Address" onChange={(e) => setEmail(e.target.value)} type='email' />
            <TextField label="password" onChange={(e) => setPassword(e.target.value)} type='password' />
            <Button variant='contained' type="submit">
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
