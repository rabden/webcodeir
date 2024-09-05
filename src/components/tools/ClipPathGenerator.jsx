import React, { useState } from 'react';

const ClipPathGenerator = () => {
  const [clipPath, setClipPath] = useState('polygon(50% 0%, 0% 100%, 100% 100%)');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Clip Path Generator</h3>
      <div className="w-full h-40 bg-blue-500 rounded" style={{ clipPath: clipPath }}></div>
      <input
        type="text"
        value={clipPath}
        onChange={(e) => setClipPath(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Enter clip-path value"
      />
    </div>
  );
};

export default ClipPathGenerator;