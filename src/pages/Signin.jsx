import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, sendPasswordResetEmail } from "firebase/auth"

import { useAuth } from '../context/AuthContext';

// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';

export default function Signin() {

  const navigate = useNavigate();

  // Signin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  // Reset
  const auth = getAuth();
  const [openDialog, setSetOpenDialog] = useState(false);
  const [emailReset, setEmailReset] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  // Theme
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    if (!email || !password) return;

    e.preventDefault();
    setError('');

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (e) {
      console.log(e.message);
      setError("Couldn't sign in. Please check your email and password.")
    }
  };

  const handlePasswordReset = () => {
    setSetOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setSetOpenDialog(false);
    setPasswordResetSent(false);
    setError('');
    setEmailReset('');
  }

  const handResetPassword = () => {
    sendPasswordResetEmail(auth, emailReset)
    .then(() => {
      setPasswordResetSent(true);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError("Unable to find an account with that email address. Did you type it correctly?");
      console.log(errorCode, errorMessage);
    });
  }

  return (
  <>
    <Dialog
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleCloseDialog}
      scroll="paper"
      aria-labelledby="add-dialog-title">
      <DialogTitle id="add-dialog-title" align='center'>
        <Typography variant="h2" component="span">Password reset</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2}}>
          { passwordResetSent && (
            <>
              <Alert severity="success">Password reset email sent.</Alert>
            </>
          )}
          { !passwordResetSent && (
            <>
              <Typography variant="body1" component="span">Enter your email address and we'll send you a link to reset your password.</Typography>
              <TextField sx={{ width: '100%' }} required value={emailReset} label="email" onChange={(e) => setEmailReset(e.target.value)} type='email' />
              { error && <Alert severity="warning">{error}</Alert> }
            </>
          )}
        </Stack>
      </DialogContent>
      { passwordResetSent && (
        <>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant='outlined'>Close</Button>
          </DialogActions>
        </>
      )}
      { !passwordResetSent && (
        <>
          <DialogActions>
            <Button onClick={handleCloseDialog} variant='outlined'>Cancel</Button>
            <Button onClick={handResetPassword} variant='contained'>Reset</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
    <Container disableGutters maxWidth="md">
      <Container maxWidth="md">
        <PageHeading heading="Sign in" />
      </Container>
      <Container>
        <Typography component="p" textAlign="center">Sign in to access the admin Dashboard.</Typography>
        <Paper sx={{ p: 2, mt: 4}} elevation={3}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 2}}>
              <TextField label="Email Address" required onChange={(e) => setEmail(e.target.value)} type='email' />
              <TextField label="password" required onChange={(e) => setPassword(e.target.value)} type='password' />
              <Button variant='contained' type="submit">
                Sign In
              </Button>
              <Button variant='outlines' onClick={() => handlePasswordReset()}>
                Forgotten password?
              </Button>
            </Stack>
          </form>

          { error && (
            <>
              <Alert severity="warning">{error}</Alert>
            </>
          )}
        </Paper>
      </Container>
    </Container>
  </>
  )
}
