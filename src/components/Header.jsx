import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Header({meta}) {
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    console.log(meta);
    setMetaData(meta);
  }, [meta?.title]);

  return (
    <Helmet>
      <title>{`${metaData.title} - Edinburgh SFF`}</title>
      <meta property="og:title" content={`${metaData.title}`} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:image" content={metaData?.image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${metaData.title} - Edinburgh SFF`} />
      <meta name="twitter:description" content={metaData.description} />
      <meta name="twitter:image" content="https://edinburghsff.com/TwitterCardMasthead.png" />
    </Helmet>
  );
};