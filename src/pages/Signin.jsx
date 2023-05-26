import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
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
    <div>
      <div>
        <Typography component="h1" variant='h1'>Sign in</Typography>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField label="Email Address" onChange={(e) => setEmail(e.target.value)} type='email' />
        </div>
        <div>
          <TextField label="password" onChange={(e) => setPassword(e.target.value)} type='password' />
        </div>
        <Button variant='outlined' type="submit">
          Sign In
        </Button>
      </form>
    </div>
  )
}
