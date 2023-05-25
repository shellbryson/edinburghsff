import React from 'react';
import { Outlet } from "react-router-dom";

// Custom Components
import Navigation from '../components/Navigation';

export default function PageLayout() {

  return (
    <>
      <Navigation home="/" title="ESFF" />
      <Outlet />
    </>
  )
}