import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ title, home }) => {
  return (
    <div className='sff-navigation'>
      <p><Link to={home}>{title}</Link></p>
    </div>
  );
};

export default Navigation;