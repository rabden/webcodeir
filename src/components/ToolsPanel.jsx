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
  const [isOpen, setIsOpen] = useState(false);

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-gray-800 text-white border-gray-700">
          {tabs.find(tab => tab.id === activeTab)?.label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            className="w-full justify-start text-white"
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            onClick={() => {
              setActiveTab(tab.id);
              setIsOpen(false);
            }}
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
        <TabSelector />
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolsPanel;