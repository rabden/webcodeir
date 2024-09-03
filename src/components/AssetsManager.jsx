import React, { useState } from 'react';
import { X } from 'lucide-react';
import ImageTab from './asset-tabs/ImageTab';
import IconTab from './asset-tabs/IconTab';
import FontTab from './asset-tabs/FontTab';
import ColorTab from './asset-tabs/ColorTab';
import LibraryTab from './asset-tabs/LibraryTab';

const AssetsManager = ({ assets, setAssets, onClose }) => {
  const [activeTab, setActiveTab] = useState('images');

  const tabs = [
    { id: 'images', label: 'Images' },
    { id: 'icons', label: 'Icons' },
    { id: 'fonts', label: 'Fonts' },
    { id: 'colors', label: 'Colors & Gradients' },
    { id: 'libraries', label: 'Libraries' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'images':
        return <ImageTab />;
      case 'icons':
        return <IconTab />;
      case 'fonts':
        return <FontTab />;
      case 'colors':
        return <ColorTab />;
      case 'libraries':
        return <LibraryTab assets={assets} setAssets={setAssets} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col z-50 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h2 className="text-2xl font-bold text-white">Asset Manager</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="bg-gray-800 p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-grow bg-gray-700 p-4 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AssetsManager;