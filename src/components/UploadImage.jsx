import React, { useState } from 'react';

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

import { v4 as uuid } from 'uuid';

// MUI Components
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const UploadImage = ({imageUploadedCallback, imgUrl}) => {

  const [progresspercent, setProgresspercent] = useState(0);

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
          imageUploadedCallback(downloadURL)
        });
      }
    );
  }

  return (
    <Box>

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
        <img src={imgUrl} alt='uploaded file' style={{ width: "50%", height: "auto" }} />
      }
    </Box>
  );
};

export default UploadImage;