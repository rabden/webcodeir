import React from 'react';

const PreviewPanel = ({ preview }) => {
  return (
    <div className="w-full h-full bg-white overflow-auto custom-scrollbar">
      <iframe
        title="preview"
        srcDoc={preview}
        className="w-full h-full border-none"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default PreviewPanel;