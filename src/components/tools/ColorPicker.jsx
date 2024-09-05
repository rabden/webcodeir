import React, { useState, useEffect } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState('#eb4034');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  useEffect(() => {
    const hslToHex = (h, s, l) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    setColor(hslToHex(hue, saturation, lightness));
  }, [hue, saturation, lightness]);

  const handleHueChange = (e) => setHue(e.target.value);
  const handleSaturationChange = (e) => setSaturation(e.target.value);
  const handleLightnessChange = (e) => setLightness(e.target.value);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/2 h-64 rounded" style={{ backgroundColor: color }}></div>
        <div className="w-1/2 h-64 rounded" style={{ background: `linear-gradient(to bottom, ${color}, black)` }}></div>
      </div>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={handleHueChange}
        className="w-full"
        style={{
          background: `linear-gradient(to right, 
            hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
            hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
            hsl(360, 100%, 50%))`
        }}
      />
      <div className="flex justify-between items-center">
        <span className="text-white">HEX</span>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-white">RGB</span>
          <div className="bg-gray-700 text-white p-2 rounded">
            {color.match(/\w\w/g).map(hex => parseInt(hex, 16)).join(', ')}
          </div>
        </div>
        <div>
          <span className="text-white">HSL</span>
          <div className="bg-gray-700 text-white p-2 rounded">
            {`${hue}°, ${saturation}%, ${lightness}%`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;