import React, { useState } from 'react';
import { X, MoreVertical } from 'lucide-react';
import FlexboxGenerator from './tools/FlexboxGenerator';
import GridGenerator from './tools/GridGenerator';
import AnimationCreator from './tools/AnimationCreator';
import MediaQueryHelper from './tools/MediaQueryHelper';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ToolsPanel = ({ onClose, isMobile }) => {
  const [activeTab, setActiveTab] = useState('flexbox');

  const tabs = [
    { id: 'flexbox', label: 'Flexbox', component: FlexboxGenerator },
    { id: 'grid', label: 'Grid', component: GridGenerator },
    { id: 'animation', label: 'Animation', component: AnimationCreator },
    { id: 'mediaQuery', label: 'Media Query', component: MediaQueryHelper },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || (() => null);

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'inset-y-4 right-4 w-96'} bg-gray-800 z-50 flex flex-col rounded-lg overflow-hidden`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">CSS Tools</h2>
        <div className="flex items-center space-x-2">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-700 text-white border-gray-600">
              {tabs.map((tab) => (
                <DropdownMenuItem 
                  key={tab.id} 
                  onSelect={() => setActiveTab(tab.id)}
                  className="hover:bg-gray-600"
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
        <ActiveComponent />
      </div>
    </div>
  );
};

export default ToolsPanel;