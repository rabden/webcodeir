import React, { useState } from 'react';
import { X } from 'lucide-react';
import ColorPicker from './tools/ColorPicker';
import GradientMaker from './tools/GradientMaker';
import BoxShadowGenerator from './tools/BoxShadowGenerator';
import TransformTool from './tools/TransformTool';

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
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Color Picker</h3>
            <ColorPicker color={color} onChange={setColor} />
          </div>
          <GradientMaker />
          <BoxShadowGenerator />
          <TransformTool />
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;