import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Header({meta}) {

  return (
    <Helmet>
      <title>{`${meta.title} - Edinburgh SFF`}</title>
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta?.image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${meta.title} - Edinburgh SFF`} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content="https://edinburghsff.com/TwitterCardMasthead.png" />
    </Helmet>
  );
};