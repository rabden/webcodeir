import React, { useState } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState('#000000');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Color Picker</h3>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full h-10 rounded"
      />
      <div className="flex justify-between items-center">
        <span className="text-white">Selected Color:</span>
        <span className="text-white font-mono">{color}</span>
      </div>
    </div>
  );
};

export default ColorPicker;