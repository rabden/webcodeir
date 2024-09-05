import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorTool = () => {
  const [color, setColor] = useState("#aabbcc");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Color Picker</h3>
      <HexColorPicker color={color} onChange={setColor} />
      <div className="flex justify-between items-center">
        <span className="text-white">HEX</span>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        />
      </div>
    </div>
  );
};

export default ColorTool;