import React, { useState } from 'react';
import { X, MoreVertical } from 'lucide-react';
import FlexboxGenerator from './FlexboxGenerator';
import GridGenerator from './GridGenerator';
import AnimationCreator from './AnimationCreator';
import MediaQueryHelper from './MediaQueryHelper';
import HtmlStructureGenerator from './HtmlStructureGenerator';
import FormGenerator from './FormGenerator';
import TableGenerator from './TableGenerator';
import MetaTagGenerator from './MetaTagGenerator';
import JsSnippetGenerator from './JsSnippetGenerator';
import EventListenerHelper from './EventListenerHelper';
import FetchApiHelper from './FetchApiHelper';
import LocalStorageHelper from './LocalStorageHelper';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ToolsPanel = ({ onClose, type }) => {
  const [activeTab, setActiveTab] = useState(
    type === 'css' ? 'flexbox' : 
    type === 'html' ? 'htmlStructure' : 
    'jsSnippet'
  );

  const cssTabs = [
    { id: 'flexbox', label: 'Flexbox', component: FlexboxGenerator },
    { id: 'grid', label: 'Grid', component: GridGenerator },
    { id: 'animation', label: 'Animation', component: AnimationCreator },
    { id: 'mediaQuery', label: 'Media Query', component: MediaQueryHelper },
  ];

  const htmlTabs = [
    { id: 'htmlStructure', label: 'HTML Structure', component: HtmlStructureGenerator },
    { id: 'form', label: 'Form', component: FormGenerator },
    { id: 'table', label: 'Table', component: TableGenerator },
    { id: 'metaTag', label: 'Meta Tags', component: MetaTagGenerator },
  ];

  const jsTabs = [
    { id: 'jsSnippet', label: 'JS Snippet', component: JsSnippetGenerator },
    { id: 'eventListener', label: 'Event Listener', component: EventListenerHelper },
    { id: 'fetchApi', label: 'Fetch API', component: FetchApiHelper },
    { id: 'localStorage', label: 'Local Storage', component: LocalStorageHelper },
  ];

  const tabs = type === 'css' ? cssTabs : type === 'html' ? htmlTabs : jsTabs;

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || (() => null);

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{type.toUpperCase()} Tools</h2>
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