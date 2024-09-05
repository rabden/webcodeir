import React from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ color, onChange }) => {
  return (
    <div className="space-y-4">
      <HexColorPicker color={color} onChange={onChange} />
      <div className="flex justify-between items-center">
        <span className="text-white">HEX</span>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        />
      </div>
    </div>
  );
};

export default ColorPicker;