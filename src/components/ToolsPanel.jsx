import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from 'lucide-react';
import ColorTool from './tools/ColorTool';
import GradientTool from './tools/GradientTool';
import ShadowTool from './tools/ShadowTool';
import TransformTool from './tools/TransformTool';

const ToolsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("color");

  const tools = [
    { id: "color", label: "Color", component: ColorTool },
    { id: "gradient", label: "Gradient", component: GradientTool },
    { id: "shadow", label: "Shadow", component: ShadowTool },
    { id: "transform", label: "Transform", component: TransformTool },
  ];

  return (
    <div className="fixed inset-y-4 right-4 w-96 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">CSS Tools</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          {tools.map(tool => (
            <TabsTrigger key={tool.id} value={tool.id}>{tool.label}</TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-grow overflow-y-auto p-4">
          {tools.map(tool => (
            <TabsContent key={tool.id} value={tool.id}>
              <tool.component />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ToolsPanel;