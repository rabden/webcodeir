import React, { useState } from 'react';
import { X } from 'lucide-react';
import FlexboxGenerator from './tools/FlexboxGenerator';
import GridGenerator from './tools/GridGenerator';
import AnimationCreator from './tools/AnimationCreator';
import MediaQueryHelper from './tools/MediaQueryHelper';

const ToolsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('flexbox');

  const tabs = [
    { id: 'flexbox', label: 'Flexbox' },
    { id: 'grid', label: 'Grid' },
    { id: 'animation', label: 'Animation' },
    { id: 'mediaQuery', label: 'Media Query' },
  ];

  const renderTool = () => {
    switch (activeTab) {
      case 'flexbox':
        return <FlexboxGenerator />;
      case 'grid':
        return <GridGenerator />;
      case 'animation':
        return <AnimationCreator />;
      case 'mediaQuery':
        return <MediaQueryHelper />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-y-4 right-4 w-96 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">CSS Tools</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolsPanel;