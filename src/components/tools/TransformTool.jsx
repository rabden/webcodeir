import React, { useState } from 'react';

const TransformTool = () => {
  const [transform, setTransform] = useState('rotate(45deg) scale(1.5)');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Transform Generator</h3>
      <div className="w-full h-20 bg-blue-500 rounded" style={{ transform: transform }}></div>
      <input
        type="text"
        value={transform}
        onChange={(e) => setTransform(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Enter CSS transform value"
      />
    </div>
  );
};

export default TransformTool;