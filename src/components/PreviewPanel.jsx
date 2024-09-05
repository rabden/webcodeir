import React from 'react';

const PreviewPanel = ({ preview }) => {
  return (
    <iframe
      title="preview"
      srcDoc={preview}
      className="w-full h-full border-none bg-white"
      sandbox="allow-scripts"
    />
  );
};

export default PreviewPanel;