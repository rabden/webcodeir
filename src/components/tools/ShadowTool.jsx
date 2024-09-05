import React, { useState } from 'react';

const ShadowTool = () => {
  const [shadow, setShadow] = useState('2px 2px 4px rgba(0,0,0,0.5)');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Shadow Generator</h3>
      <div className="w-full h-20 bg-white rounded" style={{ boxShadow: shadow }}></div>
      <input
        type="text"
        value={shadow}
        onChange={(e) => setShadow(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Enter box-shadow value"
      />
    </div>
  );
};

export default ShadowTool;