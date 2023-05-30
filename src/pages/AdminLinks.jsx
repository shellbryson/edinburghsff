import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";

import { useAuth } from '../context/AuthContext';

import { v4 as uuid } from 'uuid';

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import LinkList from '../components/LinksList';

export default function AdminLinks() {

  const { user } = useAuth();

  const [links, setLinks] = useState([])

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);

  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateUrl, setUpdateURL] = useState('');
  const [updateShow, setUpdateShow] = useState(true);
  const [updateId, setUpdateId] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [error, setError] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  useEffect(() => {
    getLinks();
  }, [])

  const q = query(collection(db, "links"), orderBy("title", "asc"));

  const getLinks = async () => {
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setLinks(l);
  }

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenUpdate = (data) => {
    setUpdateTitle(data.title);
    setUpdateDescription(data.description);
    setUpdateURL(data.url);
    setImgUrl(data.image);
    setUpdateShow(data.show);
    setUpdateId(data.id);

    setOpenUpdate(true);

    console.log("currentUser", user)
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleAdd = async (e) => {
    setError('');
    setImgUrl('');

    if (!title || !description || !url) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const docRef = await addDoc(collection(db, "links"), {
        title: title,
        description: description,
        url: url,
        show: show,
        image: strippedImageUrl,
        created: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        },
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getLinks();
      handleCloseAdd();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "links", id));
      getLinks();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async () => {
    setError('');
    setImgUrl('');

    if (!updateTitle || !updateDescription || !updateUrl) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "links", updateId);

      await updateDoc(l, {
        title: updateTitle,
        description: updateDescription,
        show: updateShow,
        image: strippedImageUrl,
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getLinks();
      handleCloseUpdate();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]

    if (!file) return;

    const filename = encodeURI(file.name);
    const storageRef = ref(storage, `links/${uuid()}___${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL)
        });
      }
    );
  }

  return (
    <Container>
      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openAdd}
        onClose={handleCloseAdd}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          <Typography variant="h2" component="span">Add New Link</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />

            { progresspercent > 0 && progresspercent < 100 &&
              <LinearProgress variant="determinate" value={progresspercent} />
            }

            <form onSubmit={handleFileUpload} className='form'>
              <input type='file' accept=".png,.jpg,.svg,.gif" />
              <IconButton type='submit'>
                <AddPhotoAlternateOutlinedIcon />
              </IconButton>
            </form>

            {
              imgUrl &&
              <img src={imgUrl} alt='uploaded file' height={200} />
            }

            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox checked />} label="Display on site" />
            </FormGroup>

            { error && <Alert severity="warning">{error}</Alert> }

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant='outlined'>Cancel</Button>
          <Button onClick={handleAdd} variant='contained'>Add Link</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openUpdate}
        onClose={handleCloseUpdate}
        scroll="paper"
        aria-labelledby="update-dialog-title">
        <DialogTitle id="update-dialog-title">
          <Typography variant="h2" component="span">Update Link</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" value={updateUrl} onChange={(e) => setUpdateURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required multiline rows={8} value={updateDescription} label="Description" onChange={(e) => setUpdateDescription(e.target.value)}  />

            { progresspercent > 0 && progresspercent < 100 &&
              <LinearProgress variant="determinate" value={progresspercent} />
            }

            <form onSubmit={handleFileUpload}>
              <input type='file' accept=".png,.jpg,.svg,.gif" />
              <IconButton type='submit'>
                <AddPhotoAlternateOutlinedIcon />
              </IconButton>
            </form>

            {
              imgUrl &&
              <img src={imgUrl} alt='uploaded file' height={200} />
            }

            <FormGroup>
              <FormControlLabel onChange={(e) => setUpdateShow(e.target.checked)} control={<Checkbox />} checked={updateShow} label="Display on site" />
            </FormGroup>
            { error && <Alert severity="warning">{error}</Alert> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} variant='outlined'>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained'>Save Link</Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Links" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenAdd()} variant='outlined'>Add Link</Button>
        </Box>
      </Container>

      <LinkList data={links} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

