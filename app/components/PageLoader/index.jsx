'use client';

import React from 'react';

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="page-loading">
      <div className="loading-spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default PageLoader;