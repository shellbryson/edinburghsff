import React from 'react';

import { useAuth } from '../context/AuthContext';

import MastheadImage from '../../assets/masthead.png';

export default function NotFound() {

  const { user } = useAuth();

  return (
    <div className="sff">

      <div className="sff-masthead">
        <img src={MastheadImage} alt="Edinburgh SFF banner image containing a space scene and mysterious forest" />
      </div>

      <header className="sff-header">
        <h1>404</h1>
        <h2>Four Oh Four - Page not found</h2>
      </header>

    </div>
  )
}
