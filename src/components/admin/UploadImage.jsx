import React, { useState } from 'react';

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";

import { v4 as uuid } from 'uuid';

// MUI Components
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import { useConfirm } from "material-ui-confirm";

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

const uploadImageFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  backgroundColor: '#f5f5f5',
  borderRadius: '0.5rem',
  marginTop: '1rem',
  marginBottom: '1rem',
}

const imagePreviewStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
  marginBottom: '1rem',
}

const toggleUploadStyle = {
  display: 'flex',
  justifyContent: 'center'
}

const imageStyle = {
  display: 'block',
  border: '1px solid #ccc',
  padding: '1px',
  width: "50%",
  height: "auto"
}

const UploadImage = ({imageUploadedCallback, imgUrl}) => {

  const confirm = useConfirm();

  const [progresspercent, setProgresspercent] = useState(0);
  const [showImageField, setShowImageField] = useState(true);

  const handleFileUpload = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]

    if (!file) return;

    const filename = encodeURI(file.name);
    const storageRef = ref(storage, `content_images/${uuid()}___${filename}`);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const filename = encodeURI(file.name);
    const storageRef = ref(storage, `content_images/${uuid()}___${filename}`);
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
          imageUploadedCallback(downloadURL);
        });
      }
    );
  };

  return (
    <Box>
      {progresspercent > 0 && progresspercent < 100 && (
        <LinearProgress variant="determinate" value={progresspercent} />
      )}

      <Box style={uploadImageFormStyle}>
        {imgUrl && (
          <Box sx={imagePreviewStyle}>
            <img src={imgUrl} alt="uploaded file" style={imageStyle} />
          </Box>
        )}

        {showImageField && (
          <div className="form">
            <input
              type="file"
              accept=".png,.jpg,.svg,.gif"
              onChange={handleFileChange}
            />
          </div>
        )}

        {imgUrl && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              const settings = {
                description: "This action will permanently delete the uploaded image.",
                confirmationText: "Delete Image",
                confirmationButtonProps: {
                  variant: "contained",
                  color: "error"
                },
                cancellationButtonProps: {
                  variant: "outlined"
                }
              };

              confirm(settings)
                .then(() => {
                  imageUploadedCallback(null); // Clear the image URL
                  setProgresspercent(0); // Reset progress
                })
                .catch(() => {
                  // User canceled the action, do nothing
                });
            }}
            startIcon={<CloudUploadOutlinedIcon />}
          >
            Remove Image
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UploadImage;