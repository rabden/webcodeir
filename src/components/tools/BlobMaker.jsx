import React, { useState } from 'react';

const BlobMaker = () => {
  const [blobPath, setBlobPath] = useState('M60,10 C50,30 30,50 10,60 C30,70 50,90 60,110 C70,90 90,70 110,60 C90,50 70,30 60,10 Z');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Blob Maker</h3>
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-40">
        <path d={blobPath} fill="#00ff00" />
      </svg>
      <textarea
        value={blobPath}
        onChange={(e) => setBlobPath(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
        rows="3"
        placeholder="Enter SVG path data"
      />
    </div>
  );
};

export default BlobMaker;