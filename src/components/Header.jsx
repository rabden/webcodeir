import React from 'react';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Header = ({
  currentCodeName,
  setCurrentCodeName,
  isMobile,
  settings,
  setSettings,
  saveCurrentCode,
  setShowPanels,
  setIsMenuOpen
}) => {
  return (
    <header className="bg-black p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <div className="w-6 h-6 bg-white rounded-sm"></div>
        <input
          type="text"
          value={currentCodeName}
          onChange={(e) => setCurrentCodeName(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none focus:outline-none text-white max-w-[150px] sm:max-w-none"
        />
      </div>
      {!isMobile && (
        <div className="flex items-center space-x-2">
          <Select
            value={settings.layout}
            onValueChange={(value) => setSettings(prev => ({ ...prev, layout: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editorsLeft">Editors Left</SelectItem>
              <SelectItem value="editorsRight">Editors Right</SelectItem>
              <SelectItem value="previewBottom">Preview Bottom</SelectItem>
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={saveCurrentCode}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <Save className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save current code</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowPanels(prev => ({ ...prev, savedCodes: !prev.savedCodes }))}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Saved Codes</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowPanels(prev => ({ ...prev, fontPanel: !prev.fontPanel }))}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <Type className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Font Library</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowPanels(prev => ({ ...prev, settings: !prev.settings }))}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default Header;