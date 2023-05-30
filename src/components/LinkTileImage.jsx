import React from 'react';

const LinkTileImage = ({ image, alt }) => {

  return (
    <div className="sff-linklist-image">
      {image &&
        <img className="sff-linklist-image__image" src={image} alt={alt} />
      }
    </div>
  );
};

export default LinkTileImage;