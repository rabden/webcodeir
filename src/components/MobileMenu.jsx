import React, { useState } from 'react';
import { X, Save, BookOpen, Settings as SettingsIcon, ChevronDown, ChevronUp, Library, Wrench, Image, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const MobileMenu = ({ isOpen, setIsOpen, setShowSettings, setShowSavedCodes, setShowFontPanel, setShowIconPanel, setShowCodeToolsPanel, setShowKeyboardShortcuts, setShowPexelsPanel, saveCurrentCode, toggleConsole, showConsole, toggleSnippetLibrary, showSnippetLibrary, setShowAIImageGeneratorPanel, session }) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <div className="sticky top-0 bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Menu</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>
      <nav className="p-4 space-y-2">
        {session && <MenuButton icon={<Save className="w-4 h-4" />} label="Save Current Code" onClick={saveCurrentCode} />}
        
        <Collapsible open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-800">
              <span className="flex items-center">
                <Library className="w-4 h-4 mr-2" />
                Library
              </span>
              {isLibraryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2 ml-4">
            {session && <MenuButton label="Saved Codes" onClick={() => setShowSavedCodes(true)} />}
            <MenuButton label="Font Library" onClick={() => setShowFontPanel(true)} />
            <MenuButton label="Icon Library" onClick={() => setShowIconPanel(true)} />
            <MenuButton label="Pexels Images" onClick={() => setShowPexelsPanel(true)} />
            <MenuButton label={`${showSnippetLibrary ? 'Hide' : 'Show'} Snippet Library`} onClick={toggleSnippetLibrary} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-800">
              <span className="flex items-center">
                <Wrench className="w-4 h-4 mr-2" />
                Tools
              </span>
              {isToolsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2 ml-4">
            <MenuButton label={`${showConsole ? 'Hide' : 'Show'} Console`} onClick={toggleConsole} />
            <MenuButton label="HTML Tools" onClick={() => setShowCodeToolsPanel('html')} />
            <MenuButton label="CSS Tools" onClick={() => setShowCodeToolsPanel('css')} />
            <MenuButton label="JS Tools" onClick={() => setShowCodeToolsPanel('js')} />
            {session && <MenuButton label="AI Image Generator" onClick={() => setShowAIImageGeneratorPanel()} />}
          </CollapsibleContent>
        </Collapsible>

        <MenuButton icon={<SettingsIcon className="w-4 h-4" />} label="Settings" onClick={() => setShowSettings(true)} />
        <MenuButton icon={<User className="w-4 h-4" />} label="Profile" onClick={() => setShowSettings(true)} />
      </nav>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
  >
    <span className="flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </span>
  </Button>
);

export default MobileMenu;