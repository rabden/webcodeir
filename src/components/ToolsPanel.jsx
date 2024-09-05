import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import FlexboxGenerator from './tools/FlexboxGenerator';
import GridGenerator from './tools/GridGenerator';
import AnimationCreator from './tools/AnimationCreator';
import MediaQueryHelper from './tools/MediaQueryHelper';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ToolsPanel = ({ onClose, isMobile }) => {
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
        return <FlexboxGenerator isMobile={isMobile} />;
      case 'grid':
        return <GridGenerator isMobile={isMobile} />;
      case 'animation':
        return <AnimationCreator isMobile={isMobile} />;
      case 'mediaQuery':
        return <MediaQueryHelper isMobile={isMobile} />;
      default:
        return null;
    }
  };

  const TabSelector = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {tabs.find(tab => tab.id === activeTab)?.label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            className="w-full justify-start"
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg overflow-hidden`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">CSS Tools</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4">
        {isMobile ? <TabSelector /> : (
          <div className="flex border-b border-gray-700 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-shrink-0 py-2 px-4 text-sm font-medium ${
                  activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolsPanel;