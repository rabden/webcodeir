import React, { useState } from 'react';
import { X, MoreVertical } from 'lucide-react';
import AIImageGenerator from './AIImageGenerator';
import AIChatbot from './AIChatbot';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ToolsPanel = ({ onClose, type }) => {
  const [activeTab, setActiveTab] = useState('aiImageGenerator');
  const [showChatbot, setShowChatbot] = useState(false);

  const aiTabs = [
    { id: 'aiImageGenerator', label: 'AI Image Generator', component: AIImageGenerator },
    { id: 'aiChatbot', label: 'AI Chatbot', component: AIChatbot },
  ];

  const ActiveComponent = aiTabs.find(tab => tab.id === activeTab)?.component || (() => null);

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col md:inset-y-4 md:right-4 md:left-auto md:w-96 md:rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">AI Tools</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-700 text-white border-gray-600">
              {aiTabs.map((tab) => (
                <DropdownMenuItem 
                  key={tab.id} 
                  onSelect={() => setActiveTab(tab.id)}
                  className="hover:bg-gray-600"
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem 
                onSelect={() => setShowChatbot(!showChatbot)}
                className="hover:bg-gray-600"
              >
                {showChatbot ? 'Hide Chatbot' : 'Show Chatbot'}
              </DropdownMenuItem>
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
      {showChatbot && <AIChatbot />}
    </div>
  );
};

export default ToolsPanel;