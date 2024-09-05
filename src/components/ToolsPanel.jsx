import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPicker from './tools/ColorPicker';
import GradientMaker from './tools/GradientMaker';
import BlobMaker from './tools/BlobMaker';
import ClipPathGenerator from './tools/ClipPathGenerator';
import BoxShadowGenerator from './tools/BoxShadowGenerator';

const ToolsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("color");

  return (
    <div className="fixed inset-y-4 right-4 w-96 bg-gray-800 shadow-lg z-50 flex flex-col rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Tools</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
          <TabsTrigger value="blob">Blob</TabsTrigger>
          <TabsTrigger value="clippath">Clip Path</TabsTrigger>
          <TabsTrigger value="boxshadow">Box Shadow</TabsTrigger>
        </TabsList>
        <div className="flex-grow overflow-y-auto p-4">
          <TabsContent value="color">
            <ColorPicker />
          </TabsContent>
          <TabsContent value="gradient">
            <GradientMaker />
          </TabsContent>
          <TabsContent value="blob">
            <BlobMaker />
          </TabsContent>
          <TabsContent value="clippath">
            <ClipPathGenerator />
          </TabsContent>
          <TabsContent value="boxshadow">
            <BoxShadowGenerator />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ToolsPanel;