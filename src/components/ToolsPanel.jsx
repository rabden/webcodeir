import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

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
        placeholder="Enter CSS gradient value"
      />
    </div>
  );
};

const ToolsPanel = ({ onClose }) => {
  const [color, setColor] = useState("#aabbcc");

  return (
    <div className="fixed inset-y-4 right-4 w-96 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">CSS Tools</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Color Picker</h3>
          <HexColorPicker color={color} onChange={setColor} />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <GradientTool />
        <ShadowTool />
        <TransformTool />
      </div>
    </div>
  );
};

export default ToolsPanel;