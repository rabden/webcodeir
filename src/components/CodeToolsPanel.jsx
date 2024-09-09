import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const CodeToolsPanel = ({ onClose, initialTab = 'html' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = {
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

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Code Tools</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="bg-gray-700 p-1 mx-4 mt-4 rounded-md">
          <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
          <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
          <TabsTrigger value="js" className="flex-1">JavaScript</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-grow p-4">
          <TabsContent value="html" className="mt-0">
            <Tabs defaultValue={tabs.html[0].id} className="w-full">
              <TabsList className="w-full mb-4">
                {tabs.html.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex-1">{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              {tabs.html.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <tab.component />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
          <TabsContent value="css" className="mt-0">
            <Tabs defaultValue={tabs.css[0].id} className="w-full">
              <TabsList className="w-full mb-4">
                {tabs.css.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex-1">{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              {tabs.css.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <tab.component />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
          <TabsContent value="js" className="mt-0">
            <Tabs defaultValue={tabs.js[0].id} className="w-full">
              <TabsList className="w-full mb-4">
                {tabs.js.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex-1">{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              {tabs.js.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  <tab.component />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CodeToolsPanel;