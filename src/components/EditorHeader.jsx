import React from 'react';

const EditorHeader = ({ lang }) => (
  <div className="bg-gray-800 p-2 flex items-center justify-between sticky top-0 editor-header">
    <div className="flex items-center">
      <div className={`w-4 h-4 rounded-full mr-2 ${lang === 'html' ? 'bg-[#ff5f56]' : lang === 'css' ? 'bg-[#27c93f]' : 'bg-[#ffbd2e]'}`}></div>
      <span className="text-sm font-semibold text-white">{lang.toUpperCase()}</span>
    </div>
  </div>
);

export default EditorHeader;