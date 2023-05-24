import React from 'react';
import { Link } from "react-router-dom";


import { UserAuth } from '../context/AuthContext';

import MastheadImage from '../assets/masthead.png';

export default function Welcome() {

  const { user } = UserAuth();

  return (
    <div className="sff">

      <div className="sff-masthead">
        <img src={MastheadImage} alt="Edinburgh SFF banner image containing a space scene and mysterious forest" />
      </div>

      <header className="sff-header">
        <h1>Edinburgh SFF</h1>
        <h2>The Science Fiction &amp; Fantasy Writing community</h2>
        <h3>New writers, Critique and Events.</h3>
      </header>

      <div className="sff-content">
        <p>For the latest information and events, find us on Mastodon <a rel="me" href="https://writing.exchange/@EdinburghSFF">@EdinburghSFF@writing.exchange</a>, Twitter <a href="https://twitter.com/edinburghsff">@edinburghsff</a> or drop into our <a href="https://discord.gg/5EaXDTwrEY">Discord</a> for a chat.</p>
      </div>

      <div className="sff-community">
        <h2>Join our community</h2>
        <p>A friendly community for writers of all levels, whether just starting out or published.</p>
        <p><a href="https://discord.gg/5EaXDTwrEY">Discord</a></p>
        <p><a rel="me" href="https://writing.exchange/@EdinburghSFF">Mastodon</a></p>
      </div>

      {user && (
        <div className="sff-content">
          <p><Link to="/dashboard">Dashboard</Link></p>
        </div>
      )}

      {!user && (
        <div className="sff-content">
          <p><Link to="/signin">Sign In</Link></p>
        </div>
      )}

    </div>
  )
}
