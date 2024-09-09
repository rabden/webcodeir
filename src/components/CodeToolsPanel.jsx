import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FlexboxGenerator from './tools/FlexboxGenerator';
import GridGenerator from './tools/GridGenerator';
import AnimationCreator from './tools/AnimationCreator';
import MediaQueryHelper from './tools/MediaQueryHelper';
import HtmlStructureGenerator from './tools/HtmlStructureGenerator';
import FormGenerator from './tools/FormGenerator';
import TableGenerator from './tools/TableGenerator';
import MetaTagGenerator from './tools/MetaTagGenerator';
import JsSnippetGenerator from './tools/JsSnippetGenerator';
import EventListenerHelper from './tools/EventListenerHelper';
import FetchApiHelper from './tools/FetchApiHelper';
import LocalStorageHelper from './tools/LocalStorageHelper';

const tools = {
  html: [
    { id: 'htmlStructure', label: 'HTML Structure', component: HtmlStructureGenerator },
    { id: 'form', label: 'Form', component: FormGenerator },
    { id: 'table', label: 'Table', component: TableGenerator },
    { id: 'metaTag', label: 'Meta Tags', component: MetaTagGenerator },
  ],
  css: [
    { id: 'flexbox', label: 'Flexbox', component: FlexboxGenerator },
    { id: 'grid', label: 'Grid', component: GridGenerator },
    { id: 'animation', label: 'Animation', component: AnimationCreator },
    { id: 'mediaQuery', label: 'Media Query', component: MediaQueryHelper },
  ],
  js: [
    { id: 'jsSnippet', label: 'JS Snippet', component: JsSnippetGenerator },
    { id: 'eventListener', label: 'Event Listener', component: EventListenerHelper },
    { id: 'fetchApi', label: 'Fetch API', component: FetchApiHelper },
    { id: 'localStorage', label: 'Local Storage', component: LocalStorageHelper },
  ],
};

const CodeToolsPanel = ({ onClose, initialTab = 'html' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeTool, setActiveTool] = useState(tools[initialTab][0].id);

  const ActiveComponent = tools[activeTab].find(tool => tool.id === activeTool)?.component || (() => null);

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-700 text-white border-gray-600">
              {activeTab.toUpperCase()} Tools <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-700 text-white border-gray-600">
            <DropdownMenuItem onSelect={() => setActiveTab('html')}>HTML Tools</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setActiveTab('css')}>CSS Tools</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setActiveTab('js')}>JS Tools</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 border-b border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full bg-gray-700 text-white border-gray-600">
              {tools[activeTab].find(tool => tool.id === activeTool)?.label || 'Select Tool'} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-700 text-white border-gray-600">
            {tools[activeTab].map((tool) => (
              <DropdownMenuItem key={tool.id} onSelect={() => setActiveTool(tool.id)}>
                {tool.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <ActiveComponent />
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeToolsPanel;