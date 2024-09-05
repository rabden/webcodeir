import React from 'react';
import { Settings as SettingsIcon, Save, BookOpen, Type, Menu, LayoutPanelLeft, LayoutPanelTop, Layout } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const Header = ({
  currentCodeName,
  setCurrentCodeName,
  isMobile,
  saveCurrentCode,
  setShowSavedCodes,
  setShowFontPanel,
  setShowSettings,
  setIsMenuOpen,
  toggleLayout,
  layout
}) => {
  const getLayoutIcon = () => {
    switch (layout) {
      case 'horizontal':
        return <LayoutPanelLeft className="w-5 h-5" />;
      case 'vertical':
        return <LayoutPanelTop className="w-5 h-5" />;
      case 'stacked':
        return <Layout className="w-5 h-5" />;
      default:
        return <LayoutPanelLeft className="w-5 h-5" />;
    }
  };

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
                  onClick={() => setShowSavedCodes(true)}
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
                  onClick={() => setShowFontPanel(true)}
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
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleLayout}
                  className="p-2 rounded-full hover:bg-gray-800"
                >
                  {getLayoutIcon()}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Layout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </header>
  );
};

export default Header;