import React from 'react';

const TileImage = ({ image, alt }) => {

  return (
    <div className="sff-tile-image">
      <img className="sff-tile-image__image" src={image} alt={alt} />
    </div>
  );
};

export default TileImage;