import React, { useState } from 'react';

const ColorTab = () => {
  const [color1, setColor1] = useState('#ff0000');
  const [color2, setColor2] = useState('#0000ff');
  const [angle, setAngle] = useState(45);

  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
    width: '100%',
    height: '100px',
    borderRadius: '8px',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Color Picker</h3>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Color 1</label>
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Color 2</label>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Gradient Generator</h3>
        <div className="space-y-2">
          <div style={gradientStyle}></div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Angle: {angle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-full"
            />
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(`background: linear-gradient(${angle}deg, ${color1}, ${color2});`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Copy CSS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorTab;