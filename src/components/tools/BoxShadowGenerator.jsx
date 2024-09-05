import React, { useState } from 'react';

const BoxShadowGenerator = () => {
  const [boxShadow, setBoxShadow] = useState('5px 5px 10px rgba(0, 0, 0, 0.3)');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Box Shadow Generator</h3>
      <div className="w-full h-40 bg-white rounded" style={{ boxShadow: boxShadow }}></div>
      <input
        type="text"
        value={boxShadow}
        onChange={(e) => setBoxShadow(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
        placeholder="Enter box-shadow value"
      />
    </div>
  );
};

export default BoxShadowGenerator;