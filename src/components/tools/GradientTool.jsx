import React, { useState } from 'react';

const GradientTool = () => {
  const [gradient, setGradient] = useState('linear-gradient(to right, #ff0000, #00ff00)');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Gradient Generator</h3>
      <div className="w-full h-20 rounded" style={{ background: gradient }}></div>
      <input
        type="text"
        value={gradient}
        onChange={(e) => setGradient(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Enter CSS gradient"
      />
    </div>
  );
};

export default GradientTool;