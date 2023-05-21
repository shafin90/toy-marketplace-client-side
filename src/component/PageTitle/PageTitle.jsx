import React, { useEffect } from 'react';

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title; // Set the document's title
  }, [title]);

  return null; // This component doesn't render anything
};

export default PageTitle;
