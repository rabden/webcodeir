import React, { useState } from 'react';
import { X, MoreVertical } from 'lucide-react';
import FlexboxGenerator from './tools/FlexboxGenerator';
import GridGenerator from './tools/GridGenerator';
import AnimationCreator from './tools/AnimationCreator';
import MediaQueryHelper from './tools/MediaQueryHelper';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className={`fixed inset-y-4 ${isMobile ? 'inset-x-4' : 'right-4'} bg-gray-800 ${isMobile ? 'w-auto' : 'w-96'} shadow-lg z-50 flex flex-col rounded-lg overflow-hidden`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">CSS Tools</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-700">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onSelect={() => setActiveTab(tab.id)}
                  className="hover:bg-gray-700"
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolsPanel;