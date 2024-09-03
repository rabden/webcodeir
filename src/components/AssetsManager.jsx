import React, { useState } from 'react';
import { X } from 'lucide-react';
import ImageTab from './asset-tabs/ImageTab';
import IconTab from './asset-tabs/IconTab';
import FontTab from './asset-tabs/FontTab';
import ColorTab from './asset-tabs/ColorTab';
import LibraryTab from './asset-tabs/LibraryTab';

const AssetsManager = ({ assets, setAssets, onClose }) => {
  const [activeTab, setActiveTab] = useState('photos');

  const tabs = [
    { id: 'packages', label: 'Packages' },
    { id: 'photos', label: 'Photos' },
    { id: 'icons', label: 'Icons' },
    { id: 'fonts', label: 'Fonts' },
    { id: 'colors', label: 'Colors' },
    { id: 'patterns', label: 'Patterns' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'photos':
        return <ImageTab />;
      case 'icons':
        return <IconTab />;
      case 'fonts':
        return <FontTab />;
      case 'colors':
        return <ColorTab />;
      case 'packages':
        return <LibraryTab assets={assets} setAssets={setAssets} />;
      case 'patterns':
        return <div>Patterns tab content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1e1e1e] flex flex-col z-50">
      <div className="flex justify-between items-center p-4 bg-[#1e1e1e] border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Assets</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex-grow flex overflow-hidden">
        <div className="w-48 bg-[#252526] p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-white mb-2">Your Files</h3>
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">PRO</span>
          </div>
          <h4 className="text-gray-400 mb-2">FREE RESOURCES</h4>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer p-2 rounded ${
                  activeTab === tab.id ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e]'
                }`}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-grow bg-[#1e1e1e] p-4 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AssetsManager;